import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { QueryBuilder } from '@/scripts/exporter';
import { useUserStore } from './userStore';

export const useParkStore = defineStore('parkStore', () => {

    // -------------------- //

    // ------------- //
    // #region State //
    // ------------- //

    const summaries = ref([]);
    const parks = ref([]);
    const campgrounds = ref([]);
    const thingstodo = ref([]);

    const parkDetails = ref({});

    // ------------- //
    // #endregion    //
    // ------------- //

    // -------------------- //

    // --------------- //
    // #region Getters //
    // --------------- //

    const getSummaries = computed(() => {
        return summaries.value;
    });

    const getParks = computed(() => {
        return parks.value;
    });

    const getCampgrounds = computed(() => {
        return campgrounds.value;
    });

    const getThingsToDo = computed(() => {
        return thingstodo.value;
    });

    const getParkDetails = computed(() => {
        return parkDetails.value;
    });

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    const base_url = `https://excursions-api-server.azurewebsites.net`;

    // --------------- //
    // #region Actions //
    // --------------- //

    const userStore = useUserStore();
    const queryBuilder = new QueryBuilder();

    async function getSummaryData() {
        let url = `${base_url}/national-parks/summary`;
        const token = userStore.getBearerToken;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        const query = queryBuilder.build(
            {
                limit: '500'
            }
        );

        if (query) {
            url += query;
        }

        console.log(url);

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json();
                summaries.value = data.data;
            }
        } else {
            // handle errors
        }

        console.log(response);

        return response;

    }

    async function getParkData(args) {
        let url = `${base_url}/national-parks`;
        const token = userStore.getBearerToken;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let results = [];

        if (parks.value.length > 0) {
            parks.value.forEach(park => {
                // console.log(park.parkCode);
                args.forEach(arg => {
                    if (park.parkCode === arg) {
                        // console.log("MATCH: " + arg);

                        let index = args.indexOf(arg);
                        args.splice(index, 1);

                        results.push(park);
                    }
                });
            });
        }

        // console.log(results);

        let parameters = {
            limit: (results.length + args.length).toString(),
        };

        // console.log(parameters);

        if (args.length === 0) {
            // const data = {
            //     total: results.length.toString(),
            //     limit: "500",
            //     start: "0",
            //     data: results
            // };

            // console.log(data);

            // return data;

            return {
                status: 200,
                total: results.length.toString(),
                limit: results.length.toString(),
                start: "0",
                data: results
            };
        }

        let parkCode = "";
        args.forEach(arg => {
            // console.log(arg);

            if (!parkCode) {
                parkCode += `${arg}`;
            } else {
                parkCode += `,${arg}`;
            }
        });

        parameters.parkCode = parkCode;

        // console.log(parameters);

        const query = queryBuilder.build(parameters);

        if (query) {
            url += query;
        }

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json();

                // console.log(data);

                data.data.forEach(item => {
                    if (!parks.value.includes(item)) {
                        parks.value.push(item);
                    }
                });

                if (results.length > 0) {
                    results.forEach(result => {
                        data.data.push(result);
                    });
                }

                // console.log(data);

                return {
                    "status": response.status,
                    "data": data
                };

            }
        } else {
            // handle errors
        }

    }

    async function getCampgroundData(args) {
        let url = `${base_url}/campgrounds`;
        const token = userStore.getBearerToken;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let results = [];

        if (campgrounds.value.length > 0) {
            campgrounds.value.forEach(campground => {
                // console.log(campground.parkCode);
                args.forEach(arg => {
                    if (campground.parkCode === arg) {
                        // console.log("MATCH: " + arg);

                        let index = args.indexOf(arg);
                        args.splice(index, 1);

                        results.push(campground);
                    }
                });
            });
        }

        // console.log(results);

        let parameters = {
            limit: "500",
        };

        if (args.length === 0) {
            const data = {
                total: results.length.toString(),
                limit: "500",
                start: "0",
                data: results
            };

            // console.log(data);

            return data;
        }

        let parkCode = "";
        args.forEach(arg => {
            // console.log(arg);

            if (!parkCode) {
                parkCode += `${arg}`;
            } else {
                parkCode += `,${arg}`;
            }
        });

        parameters.parkCode = parkCode;

        // console.log(parameters);

        const query = queryBuilder.build(parameters);

        if (query) {
            url += query;
        }

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json();

                // console.log(data);

                data.data.forEach(item => {
                    if (!campgrounds.value.includes(item)) {
                        campgrounds.value.push(item);
                    }
                });

                if (results.length > 0) {
                    results.forEach(result => {
                        data.data.push(result);
                    });
                }

                // console.log(data);

                return {
                    "status": response.status,
                    "data": data,
                };
            }
        } else {
            // handle errors
        }
    }

    async function getThingsToDoData(args) {
        let url = `${base_url}/things-to-do`;
        const token = userStore.getBearerToken;

        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        let results = [];

        if (thingstodo.value.length > 0) {
            thingstodo.value.forEach(thingtodo => {
                // console.log(thingtodo.relatedParks);

                args.forEach(arg => {
                    thingtodo.relatedParks.forEach(relatedPark => {
                        if (relatedPark.parkCode === arg) {
                            // console.log("MATCH: " + arg);

                            let index = args.indexOf(arg);
                            args.splice(index, 1);

                            results.push(thingtodo);
                        }
                    });
                });
            });
        }

        // console.log(results);

        let parameters = {
            limit: "500",
        };

        if (args.length === 0) {
            const data = {
                total: results.length.toString(),
                limit: "500",
                start: "0",
                data: results
            };

            // console.log(data);

            return data;
        }

        let parkCode = "";
        args.forEach(arg => {
            if (!parkCode) {
                parkCode += `${arg}`;
            } else {
                parkCode += `,${arg}`;
            }
        });

        parameters.parkCode = parkCode;

        // console.log(parameters);

        const query = queryBuilder.build(parameters);

        if (query) {
            url += query;
        }

        let response = await fetch(url, options);

        if (response.ok) {
            if (response.status === 200) {
                const data = await response.json();

                // console.log(data);

                data.data.forEach(item => {
                    if (!thingstodo.value.includes(item)) {
                        thingstodo.value.push(item);
                    }
                });

                if (results.length > 0) {
                    results.forEach(result => {
                        data.data.push(result);
                    });
                }

                // console.log(data);

                return {
                    "status": response.status,
                    "data": data,
                };
            }
        } else {
            // handle errors
        }
    }

    async function setParkDetails(args) {
        const data = { ...args };
        parkDetails.value = data;
    }

    function $reset() {
        summaries.value = [];
        parks.value = [];
        campgrounds.value = [];
        thingstodo.value = [];
        parkDetails.value = {};
    }

    // --------------- //
    // #endregion      //
    // --------------- //

    // -------------------- //

    return {
        // state
        summaries,
        parks,
        campgrounds,
        thingstodo,
        parkDetails,

        // getters
        getSummaries,
        getParks,
        getCampgrounds,
        getThingsToDo,
        getParkDetails,

        // actions
        getSummaryData,
        getParkData,
        getCampgroundData,
        getThingsToDoData,
        setParkDetails,
        $reset,
    };
});