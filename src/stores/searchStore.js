import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { QueryBuilder } from '@/scripts/exporter';

export const useSearchStore = defineStore('searchStore', () => {

    // -------------------- //

    // ------------- //
    // #region State //
    // ------------- //

    const query = ref([]);
    const results = ref([]);

    // ------------- //
    // #endregion    //
    // ------------- //

    // -------------------- //

    // --------------- //
    // #region Getters //
    // --------------- //

    const getQuery = computed(() => {
        return query.value;
    });

    const getResults = computed(() => {
        return results.value;
    });

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    // --------------- //
    // #region Actions //
    // --------------- //

    function resetQuery() {
        query.value = [];
    }

    function resetResults() {
        results.value = [];
    }

    function setQuery(str) {
        resetQuery();

        if (!str) {
            return;
        }

        str = str.charAt(0).toUpperCase() + str.slice(1);

        query.value.push(str);
        query.value.push(str.toLowerCase());
        query.value.push(str.toUpperCase());
    }

    function $reset() {
        query.value = [];
        results.value = [];
    }

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    return {
        // state
        query,
        results,

        // getters
        getQuery,
        getResults,

        // actions
        setQuery,
        resetQuery,
        resetResults,
        $reset,
    };
});