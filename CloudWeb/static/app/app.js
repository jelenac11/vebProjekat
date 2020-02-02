const Login = { template: '<login></login>' }
const VirtuelneMasine = { template: '<virtuelne-masine></virtuelne-masine>' }
const Diskovi = { template: '<diskovi></diskovi>' }
const Kategorije = { template: '<kategorije></kategorije>' }
const Organizacije = { template: '<organizacije></organizacije>' }
const Korisnici = { template: '<korisnici></korisnici>' }
const IzmenaProfila = { template: '<izmena-profila></izmena-profila>' }
const DodavanjeOrganizacije = { template: '<dodavanje-organizacije></dodavanje-organizacije>' }
const DodavanjeKorisnika = { template: '<dodavanje-korisnika></dodavanje-korisnika>' }
const DodavanjeKategorije = { template: '<dodavanje-kategorije></dodavanje-kategorije>' }
const DodavanjeMasine = { template: '<dodavanje-masine></dodavanje-masine>' }
const DodavanjeDiska = { template: '<dodavanje-diska></dodavanje-diska>' }
const Forbidden = { template: '<forbidden></forbidden>' }

const router = new VueRouter({
	  mode: 'hash',
	  routes: [
	    {
	    	path: '/', 
	    	component: Login 
	    },
	    {
	    	path: '/virtuelnemasine',
	    	component: VirtuelneMasine
	    },
	    {
	    	path: '/diskovi',
	    	component: Diskovi
	    },
	    {
	    	path: '/kategorije',
	    	component: Kategorije,
	    	beforeEnter: (to, from, next) => {
	    		axios
	    	    .get('ulogovan')
	    	    .then(response => {
	    	    	if (response.data.uloga == "KORISNIK" || response.data.uloga == "ADMIN") {
	    	    		next('/forbidden');
	    	    	} else {
	    	    		next();
	    	    	}
	    	    })
	    	    .catch(function (error) {
	    	    	
	    	    });
	    	}
	    },
	    {
    		path: '/organizacije',
    		component: Organizacije
	    },
	    {
			path: '/korisnici',
			component: Korisnici
	    },
	    {
			path: '/izmenaProfila',
			component: IzmenaProfila
	    },
	    {
			path: '/dodavanjeOrganizacije',
			component: DodavanjeOrganizacije
	    },
	    {
			path: '/dodavanjeKorisnika',
			component: DodavanjeKorisnika
		},
	    {
			path: '/dodavanjeKategorije',
			component: DodavanjeKategorije
	    },
	    {
			path: '/dodavanjeMasine',
			component: DodavanjeMasine
	    },
	    {
			path: '/dodavanjeDiska',
			component: DodavanjeDiska
		},
		{
	    	path: '/forbidden', 
	    	component: Forbidden 
	    },
	  ]
});

router.beforeEach((to, from, next) => {
	if (to.path != "/") {
		axios
	    .get('ulogovan')
	    .then(response => {
	    	next();
	    })
	    .catch(function (error) {
	    	console.log(error);
	    	next('/'); 
	    });
	} else {
		next();
	}
});

var app = new Vue({
	router,
	el: '#login'
});