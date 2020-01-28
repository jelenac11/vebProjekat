Vue.component("dodavanje-kategorije", {
	data: function () {
	    return {
	    	novaKategorija : {
	    		ime: "",
	    		brojJezgara: 0,
	    		RAM: 0,
	    		GPUJezgara: 0,
	    	},
	    	submitovano : false,
	    	uspesnoDodavanje : true,
    	}
	},
	template: `
<div class="container d-flex justify-content-center">
	<div class="card mt-5" style="width: 47rem;">
		<h4 class="card-header">Dodavanje kategorije</h4>
		<div class="card-body">
			<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="dodajKat" id="forma-dodaj-kat">
			  	<div class="form-row mb-3">
			  		<div class="col">
			    	 	<label for="imekat">Ime kategorije</label>
						<input type="text" v-model="novaKategorija.ime" class="form-control" id="imekat" placeholder="Ime kategorije" required>
						<div class="invalid-feedback" id="dodavanjeInvalid">Niste uneli ime.</div>
					</div>
				</div>
			  	<div class="form-row">
			    	<div class="col">
			    	 	<label for="brjez">Broj jezgara</label>
						<input type="number" v-model="novaKategorija.brojJezgara" min="1" class="form-control" id="brjez" placeholder="Broj jezgara" required>
						<div class="invalid-feedback" id="dodavanjeInvalid">Unesite ispravan broj jezgara.</div>
					</div>
					<div class="col">
			    	 	<label for="ram">RAM</label>
						<input type="number" v-model="novaKategorija.RAM" min="1" class="form-control" id="ram" placeholder="RAM" required>
						<div class="invalid-feedback" id="dodavanjeInvalid">Unesite ispravno RAM memoriju.</div>
					</div>
					<div class="col">
			    	 	<label for="gpu">GPU jezgra</label>
						<input type="number" v-model="novaKategorija.GPUJezgra" min="0" step=".1" class="form-control" id="gpu" placeholder="GPU jezgra">
						<div class="invalid-feedback" id="dodavanjeInvalid">Unesite ispravno GPU jezgra.</div>
					</div>
			  	</div>
			  	<div v-if=!uspesnoDodavanje class="alert alert-danger mt-4" role="alert">
					<p class="mb-0"><b>Greška!</b> Ime je zauzeto.</p>
				</div>
			  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit">
			  		Dodaj kategoriju
			  	</button>
			</form>
			<router-link :to="{ path: 'kategorije' }" class="btn btn-secondary">Nazad</router-link>
		</div>
	</div>
</div>	
`
	,
	methods : {
		dodajKat : function () {
			this.submitovano = true;
			if (document.getElementById('forma-dodaj-kat').checkValidity() === true) {
				axios
				.post('dodajKat', this.novaKategorija)
				.then(response => {
					this.uspesnoDodavanje = response.data;
					
					if (this.uspesnoDodavanje) {
						this.$router.replace({ path: 'kategorije' });
					}
				})
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesnoDodavanje = true;
			}
		}
	}
});