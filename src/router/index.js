import { createRouter, createWebHistory } from 'vue-router';

import {
    HomeView, MainView,
    SearchView,
    SignUpView, SignInView, ProfileView,
    SidebarView,
    ParkListingsView,
} from '@/views/exporter';

import { useUserStore } from '@/stores/userStore';
import ParkDetailsView from '@/views/parks/ParkDetailsView.vue';
import TripDetailsView from '@/views/trips/TripDetailsView.vue';
import TripListingsView from '@/views/trips/TripListingsView.vue';
import ExcursionsDetailsView from '@/views/excursions/ExcursionsDetailsView.vue';
import ExcursionListingsView from '@/views/excursions/ExcursionListingsView.vue';
import InviteListingsView from '@/views/excursions/InviteListingsView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { requiresAuth: false }
        },
        {
            path: '/sign-up',
            name: 'sign-up',
            component: SignUpView,
            meta: { requiresAuth: false },
        },
        {
            path: '/sign-in',
            name: 'sign-in',
            component: SignInView,
            meta: { requiresAuth: false },
        },
        {
            path: '/search',
            name: 'search',
            component: SearchView,
            meta: { requiresAuth: true },
        },
        {
            path: '/main',
            name: '',
            component: MainView,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'main',
                    components: {
                        leftBar: SidebarView,
                        // centerBar: ,
                        // rightBar: ,
                    },
                },
                // account
                {
                    path: '/profile',
                    name: 'profile',
                    components: {
                        leftBar: SidebarView,
                        centerBar: ProfileView,
                        // rightBar: ,
                    },
                },
                // parks
                {
                    path: '/parks',
                    name: 'park-listings',
                    components: {
                        leftBar: SidebarView,
                        centerBar: ParkListingsView,
                        // rightBar: ,
                    }
                },
                {
                    path: '/park/details',
                    name: 'park-details',
                    components: {
                        leftBar: SidebarView,
                        centerBar: ParkDetailsView,
                        // rightBar: ,
                    }
                },
                // trips
                {
                    path: '/trip',
                    name: 'trip',
                    components: {
                        leftBar: SidebarView,
                        centerBar: TripDetailsView,
                        // rightBar: ,
                    },
                },
                {
                    path: '/trips',
                    name: 'trips',
                    components: {
                        leftBar: SidebarView,
                        centerBar: TripListingsView,
                        // rightBar: ,
                    },
                },
                // excursions
                {
                    path: '/excursion',
                    name: 'excursion',
                    components: {
                        leftBar: SidebarView,
                        centerBar: ExcursionsDetailsView,
                        // rightBar: ,
                    },
                },
                {
                    path: '/excursions',
                    name: 'excursions',
                    components: {
                        leftBar: SidebarView,
                        centerBar: ExcursionListingsView,
                        // rightBar: ,
                    },
                },
                // invites
                {
                    path: '/invites',
                    name: 'invites',
                    components: {
                        leftBar: SidebarView,
                        centerBar: InviteListingsView,
                        // rightBar: ,
                    },
                },
            ]
        },
        // {
        //     path: '/parks',
        //     name: 'park-listings',
        //     component: ParkListingsView,
        //     meta: { requiresAuth: true }
        // },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/',
        },
    ],
});

router.beforeEach((to, from) => {
    const userStore = useUserStore();

    if (to.meta.requiresAuth && !userStore.getIsAuthenticated) {
        return {
            path: '/',
        };
    }

    return true;
});

export default router;
