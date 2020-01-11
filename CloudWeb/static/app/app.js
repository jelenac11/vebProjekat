const Login = { template: '<login></login>' }
const SuperAdmin = { template: '<super-admin></super-admin>' }
const IzmenaProfila = { template: '<izmena-profila></izmena-profila>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { path: '/', component: Login },
	    { path: '/superadmin', component: SuperAdmin },
	    { path: '/izmenaProfila', component: IzmenaProfila },
	  ]
});

var app = new Vue({
	router,
	el: '#login'
});