const Login = { template: '<login></login>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    { path: '/', component: Login },
	  ]
});

var app = new Vue({
	router,
	el: '#login'
});