import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// import { QueryBuilder } from '@/scripts/exporter';
import { useUserStore } from './userStore';

export const useExcursionStore = defineStore('excursionStore', () => {

    // -------------------- //

    const userStore = useUserStore();

    // ------------- //
    // #region State //
    // ------------- //

    const excursions = ref([]);
    const excursionDetails = ref();
    const newExcursion = ref();

    // ------------- //
    // #endregion    //
    // ------------- //

    // -------------------- //

    // --------------- //
    // #region Getters //
    // --------------- //

    const getExcursions = computed(() => {
        return excursions.value;
    });

    const getExcursionDetails = computed(() => {
        return excursionDetails.value;
    });

    const getNewExcursion = computed(() => {
        return newExcursion.value;
    });

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    const base_url = `https://excursions-api-server.azurewebsites.net`;

    // --------------- //
    // #region Actions //
    // --------------- //

    async function createExcursion(args) {
        const data = { ...args };
        const token = userStore.getBearerToken;

        const url = `${base_url}/excursion`;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 201) {
                const data = await response.json();
                excursions.value.push(data.excursion);
                newExcursion.value = data.excursion;
            }
        } else {
            if (response.stauts === 400) {
                throw new Error({ "Bad Request": "Could not create Excursion." });
            }

            if (response.stauts === 500) {
                throw new Error({ "Internal Server Error": "Could not create Excursion." });
            }
        }

        return response;

    }

    async function getExcursionsData(args) {
        const token = userStore.getBearerToken;

        const url = `${base_url}/excursions`;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json();
                excursions.value = data.excursions;
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not get excursions.");
            }
            if (response.status === 401) {
                throw new Error("Unauthorized: Could not get excursions.");
            }
            if (response.stauts === 500) {
                throw new Error("Internal Server Error: Could not get excursions.");
            }
        }

        return response;

    }

    async function updateExcursion(id, args) {
        const data = { ...args };
        const token = userStore.getBearerToken;

        const url = `${base_url}/excursion/${id}`;

        const options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                await getExcursionsData();
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not update excursion.");
            }

            if (response.status === 401) {
                throw new Error("Unauthorized: Could not update excursion.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not update excursion.");
            }
        }

        return response;
    }

    async function deleteExcursion(id, args) {
        const data = { ...args };
        const token = userStore.getBearerToken;

        const url = `${base_url}/excursion/${id}`;

        const options = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                await getTripsData();
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not delete excursion.");
            }

            if (response.status === 401) {
                throw new Error("Unauthorized: Could not delete excursion.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not delete excursion.");
            }
        }

        return response;
    }

    async function setExcursionDetails(args) {
        const data = { ...args };
        excursionDetails.value = data;
    }

    function $reset() {
        excursions.value = [];
        excursionDetails.value = '';
        newExcursion.value = '';
    }

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    return {
        // state
        excursions,
        excursionDetails,
        newExcursion,

        // getters
        getExcursions,
        getExcursionDetails,
        getNewExcursion,

        // actions
        createExcursion,
        getExcursionsData,
        updateExcursion,
        deleteExcursion,
        setExcursionDetails,
        $reset,
    };
});