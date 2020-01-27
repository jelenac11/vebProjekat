Vue.component("izmena-profila", {
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
	    	uspesnaIzmena : true,
	    	porukaUspeha : false,
	    	tip : null,
	    }
	},
	template: `
<div class="container d-flex justify-content-center">
	<div class="card mt-5" style="width: 47rem;">
		<h4 class="card-header">Izmena podataka o profilu</h4>
		<div class="card-body">
			<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="izmenaPod" id="forma-izmena">
			  	<div class="form-row mb-3">
			  		<div class="col">
			    	 	<label for="email">Email adresa</label>
						<input type="email" v-model="korisnik.email" class="form-control" id="email" placeholder="Email" required>
						<div class="invalid-feedback" id="izmenaInvalid">Neispravan email.</div>
					</div>
				</div>
			  	<div class="form-row">
			    	<div class="col">
			    	 	<label for="ime">Ime</label>
						<input type="text" v-model="korisnik.ime" class="form-control" id="ime" placeholder="Ime" required>
						<div class="invalid-feedback" id="izmenaInvalid">Niste uneli ime.</div>
					</div>
			    	<div class="col">
			    		<label for="prezime">Prezime</label>
						<input type="text" v-model="korisnik.prezime" class="form-control" id="prezime" placeholder="Prezime" required>
			    		<div class="invalid-feedback" id="izmenaInvalid">Niste uneli prezime.</div>
			    	</div>
			  	</div>
			  	<div v-if=!uspesnaIzmena class="alert alert-danger mt-4" role="alert">
					<p class="mb-0"><b>Greška!</b> Korisnik sa unetom Email adresom već postoji.</p>
				</div>
				<div v-if=porukaUspeha class="alert alert-success mt-4" role="alert">
					<p class="mb-0"><b>Upešno ste izmenili svoje podatke!</b></p>
				</div>
			  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit">Izmeni podatke</button>
			</form>
			<router-link :to="{ path: this.tip }" class="btn btn-secondary">Nazad</router-link>
		</div>
	</div>
</div>	
`
	,
	methods : {
		izmenaPod : function () {
			this.submitovano = true;
			if (document.getElementById('forma-izmena').checkValidity() === true) {
				axios
				.post('izmeniProfil', this.korisnik)
				.then(response => {
					this.uspesnaIzmena = response.data;
					this.porukaUspeha = response.data;
				})
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesnaIzmena = true;
				this.porukaUspeha = false;
			}
		}
	},
	mounted () {
		axios
        .get('ulogovan')
        .then(response => {
        	this.korisnik = response.data;
        	if (this.korisnik.uloga == "SUPER_ADMIN") {
        		this.tip = 'superadmin';
        	} else if (this.korisnik.uloga == "ADMIN") {
        		this.tip = 'admin';
        	} else if (this.korisnik.uloga == "KORISNIK") {
        		this.tip = 'korisnik';
        	}
        })
        .catch(function (error) { console.log(error); });
	}
});