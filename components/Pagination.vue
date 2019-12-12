<template>
  <!-- <div class="pagination is-centered is-rounded is-primary" role="navigation" aria-label="pagination"> -->
  <div class="columns tengah is-mobile">
    <div class="column is-one-third">
      <button
        class="button is-small is-rounded is-primary"
        @click.prevent="changePage(1)"
        :disabled="pagination.current_page <= 1"
      >
        <span v-html="'|<'"></span>
      </button>

      <button
        class="button is-small is-rounded is-primary"
        @click.prevent="changePage(pagination.current_page - 1)"
        :disabled="pagination.current_page <= 1"
      >
        <span v-html="'<<'"></span>
      </button>
    </div>
    <div class="column is-one-third is-centered">
      <div class="field has-addons is-centered">
        <p class="control" v-for="(page, key) in pages" :key="key">
          <a class="button is-small is-rounded is-primary"
          :class="isCurrentPage(page) ? 'is-current' : ''"
          @click.prevent="changePage(page)">
            <span>{{ page }}</span>
          </a>
        </p>
      </div>
    </div>
    <div class="column is-one-third">
      <button
        class="button is-small is-rounded is-primary"
        @click.prevent="changePage(pagination.current_page + 1)"
        :disabled="pagination.current_page >= pagination.total_pages"
      >
        <span v-html="'>>'"></span>
      </button>
      <button
        class="button is-small is-rounded is-primary"
        @click.prevent="changePage(pagination.total_pages)"
        :disabled="pagination.current_page >= pagination.total_pages"
      >
        <span v-html="'>|'"></span>
      </button>
    </div>
  </div>
  <!-- </div> -->
</template>
<style>
.tengah {
  text-align: center;
}
</style>

<script>
export default {
  props: ["pagination", "offset"],
  methods: {
    isCurrentPage(page) {
      return this.pagination.current_page === page;
    },
    changePage(page) {
      if (page > this.pagination.total_pages) {
        page = this.pagination.total_pages;
      } else if (page < 1) {
        page = 1;
      }
      this.pagination.current_page = page;
      this.$emit("paginate");
    }
  },
  computed: {
    pages() {
      let pages = [];
      let from = this.pagination.current_page - Math.floor(this.offset / 2);
      if (from < 1) {
        from = 1;
      }
      let to = from + this.offset - 1;
      if (to > this.pagination.total_pages) {
        to = this.pagination.total_pages;
      }
      while (from <= to) {
        pages.push(from);
        from++;
      }
      return pages;
    }
  }
};
</script>