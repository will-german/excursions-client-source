import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// import { QueryBuilder } from '@/scripts/exporter';
import { useUserStore } from './userStore';

export const useTripStore = defineStore('tripStore', () => {

    // -------------------- //

    const userStore = useUserStore();

    // ------------- //
    // #region State //
    // ------------- //

    const trips = ref([]);
    const tripDetails = ref();
    const newTrip = ref();

    // ------------- //
    // #endregion    //
    // ------------- //

    // -------------------- //

    // --------------- //
    // #region Getters //
    // --------------- //

    const getTrips = computed(() => {
        return trips.value;
    });

    const getTripDetails = computed(() => {
        return tripDetails.value;
    });

    const getNewTrip = computed(() => {
        return newTrip.value;
    });

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    const base_url = `https://excursions-api-server.azurewebsites.net`;

    // --------------- //
    // #region Actions //
    // --------------- //

    // const queryBuilder = new QueryBuilder();

    async function createTrip(args) {
        const data = { ...args };
        const token = userStore.getBearerToken;

        const url = `${base_url}/trip`;

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
                trips.value.push(data.trip);
                newTrip.value = data.trip;
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not create trip");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not create user.");
            }
        }

        return response;

    }

    async function getTripsData() {
        const token = userStore.getBearerToken;

        const url = `${base_url}/trips`;

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
                trips.value = data.trips;
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not get trips.");
            }
            if (response.status === 401) {
                throw new Error("Unauthorized: Could not get trips.");
            }
            if (response.stauts === 500) {
                throw new Error("Internal Server Error: Could not get trips.");
            }
        }

        return response;
    }

    async function updateTrip(id, args) {
        const data = { ...args };
        const token = userStore.getBearerToken;

        const url = `${base_url}/trip/${id}`;

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
                await getTripsData();
            }
        } else {
            if (response.status === 400) {
                throw new Error("Bad Request: Could not update trip.");
            }

            if (response.status === 401) {
                throw new Error("Unauthorized: Could not update trip.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not update trip.");
            }
        }

        return response;
    }

    async function deleteTrip(id, args) {
        const data = { ...args };
        const token = userStore.getBearerToken;

        const url = `${base_url}/trip/${id}`;

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
                throw new Error("Bad Request: Could not delete trip.");
            }

            if (response.status === 401) {
                throw new Error("Unauthorized: Could not delete trip.");
            }

            if (response.status === 500) {
                throw new Error("Internal Server Error: Could not delete trip.");
            }
        }

        return response;

    }

    async function setTripDetails(args) {
        const data = { ...args };
        tripDetails.value = data;
    }

    function $reset() {
        trips.value = [];
        tripDetails.value = '';
        newTrip.value = '';
    }

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    return {
        // state
        trips,
        tripDetails,
        newTrip,

        // getters
        getTrips,
        getTripDetails,
        getNewTrip,

        // actions
        createTrip,
        getTripsData,
        updateTrip,
        deleteTrip,
        setTripDetails,
        $reset,
    };
});