const Login = { template: '<login></login>' }
const SuperAdmin = { template: '<super-admin></super-admin>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { path: '/', component: Login },
	    { path: '/superadmin', component: SuperAdmin },
	  ]
});

var app = new Vue({
	router,
	el: '#login'
});