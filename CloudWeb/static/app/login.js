Vue.component("login", {
	data: function () {
	    return {
	    	korisnik : {
	    		email : "",
	    		lozinka : "",
	    		ime : "",
	    		prezime : "",
	    		organizacija : null,
	    		uloga : null
	    	},
	    	submitovano : false,
	    	uspesanLogin : true
	    }
	},
	template: `
<div class="text-center">
	<div class="container">
		<form class="form-signin needs-validation" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="login" id="forma-login">
			<img class="mb-3" src="./caticon.png" alt="" width="100" height="100">
			<h1 class="h3 mb-3 font-weight-normal">Ulogujte se</h1>
			<div class="input-group">
				<label for="inputEmail" class="sr-only">Email adresa</label>
				<input v-model="korisnik.email" type="email" id="inputEmail" class="form-control" placeholder="Email adresa" required>
				<div class="invalid-feedback">Niste ispravno uneli Email adresu.</div>
			</div>
			<div class="input-group">
				<label for="inputPassword" class="sr-only">Lozinka</label>
				<input v-model="korisnik.lozinka" type="password" id="inputPassword" class="form-control" placeholder="Lozinka" required>
				<div class="invalid-feedback">Niste uneli lozinku.</div>
			</div>
			<div v-if=!uspesanLogin class="alert alert-danger" role="alert">
				<p class="mb-0"><b>Greška!</b> Pogrešna Email adresa ili pogrešna lozinka. Pokušajte ponovo.</p>
			</div>
			<button class="btn btn-lg btn-primary btn-block" type="submit">Prijavite se</button>
			<p class="mt-5 mb-3 text-muted">&copy; 2019-2020</p>
	    </form>
	</div>
</div>
`
	,
	methods : {
		login : function () {
			this.submitovano = true;
			if (document.getElementById('forma-login').checkValidity() === true) {
				axios
				.post('login', this.korisnik)
				.then(response => (this.validiraj(response.data)))
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesanLogin = true;
			}
		},
		validiraj : function (uspesan) {
			this.uspesanLogin = uspesan;
			if (this.uspesanLogin) { 
				this.$router.replace({ path: 'virtuelnemasine' });
			}
		}
	}
});