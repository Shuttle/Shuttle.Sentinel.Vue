<template>
  <div>
    <div class="home">
      <h1>Sentinel Citation Report</h1>
    </div>
    <div class="d-flex justify-content-center m-5" v-if="working">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div v-if="isStarting">
      <h2>How would you like to get your references?</h2>
      <b-card-group deck>
        <b-card title="Find them in my document...">
          <b-card-text>
            <b-form>
              <b-form-group>
                <b-form-file id="pdf-file" v-model="pdfFile" accept="application/pdf"></b-form-file>
              </b-form-group>
            </b-form>
          </b-card-text>
          <template v-slot:footer>
            <b-button variant="outline-primary" @click="goPdf">Go</b-button>
          </template>
        </b-card>

        <b-card title="I have copied them...">
          <b-card-text>
            <b-form>
              <b-form-input v-model="textReferences" placeholder="(paste your references)"></b-form-input>
            </b-form>
          </b-card-text>
          <template v-slot:footer>
            <b-button variant="outline-primary">Go</b-button>
          </template>
        </b-card>

        <b-card title="I have BibTeX references...">
          <b-card-text>
            <b-form>
              <b-form-group>
                <b-form-file id="bibtext-file"></b-form-file>
              </b-form-group>
              <b-form-group>
                <b-form-input v-model="bibtexReferences" placeholder="(paste your references)"></b-form-input>
              </b-form-group>
            </b-form>
          </b-card-text>
          <template v-slot:footer>
            <b-button variant="outline-primary">Go</b-button>
          </template>
        </b-card>

        <b-card title="Else...">
          <b-card-text>
            <p>I'll enter all my references manually.</p>
          </b-card-text>
          <template v-slot:footer>
            <b-button variant="outline-primary">Go</b-button>
          </template>
        </b-card>
      </b-card-group>
    </div>
    <div v-if="isInitialReview">
      <b-button variant="outline-primary" @click="goBack">Back</b-button>
      <b-button variant="outline-success" @click="findReferences" class="ml-2">Find References</b-button>
      <b-table
        striped
        dark
        hover
        :items="reviewTextReferences"
        :fields="reviewTextReferenceFields"
        head-variant="dark"
        class="mt-2"
      >
        <template v-slot:cell(removed)="data">
          <b-button variant="outline-primary" @click="toggleTextReference(data.item)">toggle</b-button>
        </template>
        <template v-slot:cell(textReference)="data">{{data.item.textReference}}</template>
      </b-table>
    </div>
    <div v-if="isReferenceReview">
      <b-button variant="outline-primary" @click="goBack">Back</b-button>
      <b-button variant="outline-success" class="ml-2">Generate Report</b-button>
      <b-table
        striped
        dark
        hover
        :items="reviewReferences"
        :fields="reviewReferenceFields"
        head-variant="dark"
        class="mt-2"
      >
        <template v-slot:cell(removed)="data">
          <b-button variant="outline-primary" @click="toggleReference(data.item)">toggle</b-button>
        </template>
        <template v-slot:cell(textReference)="data">{{data.item.textReference}}</template>
        <template v-slot:cell(titles)="data">
          <ul>
            <li v-for="item in data.item.titleMatches" :key="item.title">{{ item.title }}</li>
          </ul>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Report",
  data() {
    return {
      pdfFile: null,
      textReferences: "",
      bibtexReferences: "",
      working: false,
      term: "",
      step: 1,
      reviewTextReferences: [],
      reviewTextReferenceFields: [],
      reviewReferences: [],
      reviewReferenceFields: [],
      referenceReportId: "",
    };
  },
  computed: {
    isStarting() {
      return !this.working && this.step === 1;
    },
    isInitialReview() {
      return !this.working && this.step === 2;
    },
    isReferenceReview() {
      return !this.working && this.step === 3;
    },
  },
  methods: {
    toggleTextReference(item) {
      item.removed = !item.removed;

      if (item.removed) {
        item.textReferencePrevious = item.textReference;
        item.textReference = "(removed)";
      } else {
        item.textReference = item.textReferencePrevious;
      }
    },
    toggleReference(item) {
      item.removed = !item.removed;

      if (item.removed) {
        item.textReferencePrevious = item.textReference;
        item.textReference = "(removed)";
      } else {
        item.textReference = item.textReferencePrevious;
      }
    },
    goBack(evt) {
      evt.preventDefault();

      this.step--;
    },
    goPdf() {
      const self = this;

      this.step = 2;
      this.working = true;

      let formData = new FormData();

      formData.append("file", this.pdfFile);

      self.$api
        .post("referencereports", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function (response) {
          self.working = false;
          self.referenceReportId = response.data.referenceReportId;
          self.reviewTextReferences = response.data.textReferences;
        })
        .catch(function () {
          self.working = false;
        });
    },
    findReferences() {
      const self = this;

      this.step = 3;
      this.working = true;

      self.$api
        .post("referencereports/analyze", {
          referenceReportId: self.referenceReportId,
          removedSequenceNumbers: self.reviewTextReferences
            .filter((item) => {
              return !!item.removed;
            })
            .map((item) => item.sequenceNumber),
        })
        .then(function (response) {
          self.working = false;
          self.reviewReferences = response.data.referenceReportWorks;
        })
        .catch(function () {
          self.working = false;
        });
    },
    selectPdfFile() {
      this.pdfFile = this.$refs.pdfFiles.files[0];
    },
  },
  beforeMount() {
    this.reviewTextReferenceFields = [
      {
        label: "#",
        key: "sequenceNumber",
        sortable: true,
      },
      {
        label: "Page",
        key: "pageNumber",
        sortable: true,
      },
      {
        key: "removed",
        label: "Review",
      },
      {
        label: "Reference",
        key: "textReference",
        sortable: true,
      },
    ];
    this.reviewReferenceFields = [
      {
        label: "Page",
        key: "pageNumber",
        sortable: true,
      },
      {
        key: "removed",
        label: "Review",
      },
      {
        label: "Reference",
        key: "textReference",
        sortable: true,
      },
      {
        label: "Titles",
        key: "titles",
      },
    ];
  },
};
</script>
