Vue.component("super-admin", {
	data: function () {
	    return {
	    	supAdm : {
	    		email : "",
	    		lozinka : "",
	    		ime : "",
	    		prezime : "",
	    		organizacija : null,
	    		uloga : null
	    	},
    	}
	},
	template: `
<div>
	<a v-on:click="logout" href="#">Odjavi se</a>
</div>
`
	,
	methods : {
		logout : function () {
			axios
			.get('logout')
			.then(response => (this.$router.replace({ path: '/' })))
			.catch(function (error) { console.log(error); });
		},
	},
	mounted () {
		axios
        .get('ulogovan')
        .then(response => (this.supAdm = response.data))
        .catch(function (error) { console.log(error); });
	}
});