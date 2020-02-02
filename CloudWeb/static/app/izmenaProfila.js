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
	    	noviKorisnik : {},
	    	submitovano : false,
	    	uspesnaIzmena : true,
	    	porukaUspeha : false,
	    	poklapajuSeLozinke : true,
	    	novaLozinka : "",
	    	potvrdaLozinke : "",
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
						<input type="email" v-model="noviKorisnik.email" class="form-control" id="email" placeholder="Email" required>
						<div class="invalid-feedback" id="izmenaInvalid">Neispravan email.</div>
					</div>
				</div>
				<div class="form-row">
			    	<div class="col">
			    	 	<label for="lozinka1">Lozinka</label>
						<input type="password" minlength="8" maxlength="20" v-model="novaLozinka" class="form-control" id="lozinka1" placeholder="Lozinka">
						<small id="passwordHelpBlock" class="form-text text-muted">
						  	Lozinka mora imati 8-20 karaktera.
						</small>
						<div class="invalid-feedback" id="izmenaInvalid">Neodgovarajuća dužina lozinke.</div>
					</div>
			    	<div class="col">
			    		<label for="lozinka2">Potvrdite lozinku</label>
						<input type="password" v-model="potvrdaLozinke" class="form-control" v-bind:class="{ nePoklapajuSe : !poklapajuSeLozinke }" id="lozinka2" v-bind:disabled="novaLozinka == ''" placeholder="Lozinka">
						<div class="invalid-feedback" v-bind:class="{ 'd-block' : !poklapajuSeLozinke }" id="dodavanjeInvalid">Lozinke se ne poklapaju!</div>
			    	</div>
			  	</div>
			  	<div class="form-row">
			    	<div class="col">
			    	 	<label for="ime">Ime</label>
						<input type="text" v-model="noviKorisnik.ime" class="form-control" id="ime" placeholder="Ime" required>
						<div class="invalid-feedback" id="izmenaInvalid">Niste uneli ime.</div>
					</div>
			    	<div class="col">
			    		<label for="prezime">Prezime</label>
						<input type="text" v-model="noviKorisnik.prezime" class="form-control" id="prezime" placeholder="Prezime" required>
			    		<div class="invalid-feedback" id="izmenaInvalid">Niste uneli prezime.</div>
			    	</div>
			  	</div>
			  	<div v-if=!uspesnaIzmena class="alert alert-danger mt-4" role="alert">
					<p class="mb-0"><b>Greška!</b> Korisnik sa unetom Email adresom već postoji.</p>
				</div>
				<div v-if=porukaUspeha class="alert alert-success mt-4" role="alert">
					<p class="mb-0"><b>Upešno ste izmenili svoje podatke!</b></p>
				</div>
			  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit" v-bind:disabled="korisnik.email == noviKorisnik.email && korisnik.ime == noviKorisnik.ime && korisnik.prezime == noviKorisnik.prezime && novaLozinka == ''">Izmeni podatke</button>
			</form>
			<router-link :to="{ path: 'virtuelnemasine' }" class="btn btn-secondary">Nazad</router-link>
		</div>
	</div>
</div>	
`
	,
	methods : {
		izmenaPod : function () {
			this.proveriLozinke();
			this.submitovano = true;
			if (document.getElementById('forma-izmena').checkValidity() === true && this.poklapajuSeLozinke) {
				axios
				.post('izmeniProfil', this.noviKorisnik)
				.then(response => {
					this.uspesnaIzmena = response.data;
					this.porukaUspeha = response.data;
					this.korisnik = JSON.parse(JSON.stringify(this.noviKorisnik));
				})
				.catch(error => {
					console.log(error);
					this.uspesnaIzmena = false;
					this.porukaUspeha = false;
				});
			} else {
				this.uspesnaIzmena = true;
				this.porukaUspeha = false;
			}
		},
		proveriLozinke : function () {
			if (this.novaLozinka != "") {
				this.noviKorisnik.lozinka = this.novaLozinka
				if (this.novaLozinka != this.potvrdaLozinke) {
					this.poklapajuSeLozinke = false;
				} else {
					this.poklapajuSeLozinke = true;
				}
			} else {
				this.poklapajuSeLozinke = true;
				this.noviKorisnik.lozinka = this.korisnik.lozinka;
			}
		},
	},
	mounted () {
		axios
        .get('ulogovan')
        .then(response => {
        	this.korisnik = JSON.parse(JSON.stringify(response.data));
        	this.noviKorisnik = JSON.parse(JSON.stringify(response.data));
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