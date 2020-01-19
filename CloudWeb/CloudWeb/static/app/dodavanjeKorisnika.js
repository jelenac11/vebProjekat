Vue.component("dodavanje-korisnika", {
	data: function () {
	    return {
	    	noviKorisnik : {
	    		email : "",
	    		lozinka : "",
	    		ime : "",
	    		prezime : "",
	    		organizacija : "",
	    		uloga : null
	    	},
	    	organizacije : [],
	    	potvrdaLozinke : "",
	    	submitovano : false,
	    	uspesnoDodavanje : true,
	    	poklapajuSeLozinke : true,
    	}
	},
	template: `
<div class="container d-flex justify-content-center">
	<div class="card mt-5" style="width: 47rem;">
		<h4 class="card-header">Dodavanje korisnika</h4>
		<div class="card-body">
			<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="dodajKor" id="forma-dodaj-kor">
			  	<div class="form-row mb-3">
			  		<div class="col">
			    	 	<label for="email">Email adresa</label>
						<input type="email" v-model="noviKorisnik.email" class="form-control" id="email" placeholder="Email" required>
						<div class="invalid-feedback" id="dodavanjeInvalid">Neispravan email.</div>
					</div>
				</div>
				<div class="form-row">
			    	<div class="col">
			    	 	<label for="lozinka1">Lozinka</label>
						<input type="password" minlength="8" maxlength="20" v-model="noviKorisnik.lozinka" class="form-control" id="lozinka1" placeholder="Lozinka" required>
						<small id="passwordHelpBlock" class="form-text text-muted">
						  	Lozinka mora imati 8-20 karaktera.
						</small>
						<div class="invalid-feedback" id="dodavanjeInvalid">Neodgovarajuća dužina lozinke.</div>
					</div>
			    	<div class="col">
			    		<label for="lozinka2">Potvrdite lozinku</label>
						<input type="password" v-model="potvrdaLozinke" class="form-control" v-bind:class="{ nePoklapajuSe : !poklapajuSeLozinke }" id="lozinka2" placeholder="Lozinka">
						<div class="invalid-feedback" v-bind:class="{ 'd-block' : !poklapajuSeLozinke }" id="dodavanjeInvalid">Lozinke se ne poklapaju!</div>
			    	</div>
			  	</div>
			  	<div class="form-row">
			    	<div class="col">
			    	 	<label for="ime" class="mt-1">Ime</label>
						<input type="text" v-model="noviKorisnik.ime" class="form-control" id="ime" placeholder="Ime" required>
						<div class="invalid-feedback" id="dodavanjeInvalid">Niste uneli ime.</div>
					</div>
			    	<div class="col">
			    		<label for="prezime" class="mt-1">Prezime</label>
						<input type="text" v-model="noviKorisnik.prezime" class="form-control" id="prezime" placeholder="Prezime" required>
			    		<div class="invalid-feedback" id="dodavanjeInvalid">Niste uneli prezime.</div>
			    	</div>
			    	<div class="col">
			    		<label for="uloga" class="mt-1">Uloga</label>
			    		<select class="custom-select mt-0" v-model="noviKorisnik.uloga" id="uloga" required>
					    	<option value="ADMIN">Admin</option>
					    	<option value="KORISNIK">Korisnik</option>
					  	</select>
			    		<div class="invalid-feedback" id="dodavanjeInvalid">Niste odabrali ulogu.</div>
			    	</div>
			  	</div>
			  	<div class="form-row">
			    	<div class="col">
			    		<label for="organ" class="mt-1">Organizacija</label>
						<select class="custom-select mt-0" v-model="noviKorisnik.organizacija" id="organ" required>
					    	<option v-for="o in organizacije" :value="o.ime">
								{{ o.ime }}
					    	</option>
					  	</select>
					  	<div class="invalid-feedback" id="dodavanjeInvalid">Niste izabrali organizaciju.</div>
					</div>
			  	</div>
			  	<div v-if=!uspesnoDodavanje class="alert alert-danger mt-4" role="alert">
					<p class="mb-0"><b>Greška!</b> Korisnik sa unetom Email adresom već postoji.</p>
				</div>
			  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit">
			  		Dodaj korisnika
			  	</button>
			</form>
			<router-link :to="{ path: 'superadmin' }" class="btn btn-secondary">Nazad</router-link>
		</div>
	</div>
</div>	
`
	,
	methods : {
		dodajKor : function () {
			this.proveriLozinke();
			this.submitovano = true;
			if (document.getElementById('forma-dodaj-kor').checkValidity() === true && this.poklapajuSeLozinke) {
				axios
				.post('dodajKor', this.noviKorisnik)
				.then(response => {
					this.uspesnoDodavanje = response.data;
					
					if (this.uspesnoDodavanje) {
						this.$router.replace({ path: 'superadmin' });
					}
				})
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesnoDodavanje = true;
			}
		},
		proveriLozinke : function () {
			if (this.noviKorisnik.lozinka != this.potvrdaLozinke) {
				this.poklapajuSeLozinke = false;
			} else {
				this.poklapajuSeLozinke = true;
			}
		}
	},
	mounted () {
		axios
        .get('ucitajOrganizacije')
        .then(response => (this.organizacije = response.data))
        .catch(function (error) { console.log(error); });
	}
});