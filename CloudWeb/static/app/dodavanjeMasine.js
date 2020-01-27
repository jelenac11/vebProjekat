Vue.component("dodavanje-masine", {
	data: function () {
	    return {
	    	novaMasina : {
	    		ime: "",
	    		kategorija : {},
	    		brojJezgara: 0,
	    		RAM: 0,
	    		GPUJezgara: 0.0,
	    		ogranizacija : "",
	    		diskovi : [],
	    		aktivnosti : []
	    	},
	    	organizacije : [],
	    	kategorije : [],
	    	submitovano : false,
	    	uspesnoDodavanje : true,
    	}
	},
	template: `
<div class="container d-flex justify-content-center">
	<div class="card mt-5" style="width: 47rem;">
		<h4 class="card-header">Dodavanje virtuelne masine</h4>
		<div class="card-body">
			<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="dodajVM" id="forma-dodaj-vm">
			  	<div class="form-row mb-3">
			  		<div class="col">
			    	 	<label for="imevm">Ime</label>
						<input type="text" v-model="novaMasina.ime" class="form-control" id="imevm" placeholder="Ime" required>
						<div class="invalid-feedback" id="izmenaInvalid">Niste uneli ime.</div>
					</div>
				</div>
				<div class="form-row">
			    	<div class="col">
			    	 	<label for="kateg" class="mt-1">Kategorija</label>
							<select class="custom-select mt-0" v-model="novaMasina.kategorija" v-on:change="popuniVM" id="kateg" required>
						    	<option v-for="kat in kategorije" :value="kat">
									{{ kat.ime }}
						    	</option>
						  	</select>
						  	<div class="invalid-feedback" id="dodavanjeInvalid">Niste izabrali kategoriju.</div>
			    	</div>
			  	</div>
			  	<div class="form-row">
			    	<div class="col">
			    	 	<label for="brojjez">Broj jezgara</label>
						<input type="number" v-model="novaMasina.brojJezgara" min="1" class="form-control" id="brojjez" placeholder="Broj jezgara" disabled required>
					</div>
					<div class="col">
			    	 	<label for="vmram">RAM</label>
						<input type="number" v-model="novaMasina.RAM" min="1" class="form-control" id="vmram" placeholder="RAM" disabled required>
					</div>
					<div class="col">
			    	 	<label for="vmgpu">GPU jezgra</label>
						<input type="number" v-model="novaMasina.GPUJezgra" min="0" step=".1" class="form-control" id="vmgpu" placeholder="GPU jezgra" disabled required>
					</div>
			  	</div>
			  	<div class="form-row">
			    	<div class="col">
			    		<label for="vmorgan" class="mt-1">Organizacija</label>
						<select class="custom-select mt-0" v-model="novaMasina.organizacija" id="vmorgan" required>
					    	<option v-for="o in organizacije" :value="o.ime">
								{{ o.ime }}
					    	</option>
					  	</select>
					  	<div class="invalid-feedback" id="dodavanjeInvalid">Niste izabrali organizaciju.</div>
					</div>
			  	</div>
			  	<div v-if=!uspesnoDodavanje class="alert alert-danger mt-4" role="alert">
					<p class="mb-0"><b>Greška!</b> Ime je zauzeto.</p>
				</div>
			  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit">
			  		Dodaj virtuelnu mašinu
			  	</button>
			</form>
			<router-link :to="{ path: 'superadmin' }" class="btn btn-secondary">Nazad</router-link>
		</div>
	</div>
</div>	
`
	,
	methods : {
		dodajVM : function () {
			this.submitovano = true;
			if (document.getElementById('forma-dodaj-vm').checkValidity() === true) {
				axios
				.post('dodajVM', this.novaMasina)
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
		popuniVM() {
	    	this.novaMasina.brojJezgara = this.novaMasina.kategorija.brojJezgara;
	    	this.novaMasina.RAM = this.novaMasina.kategorija.RAM;
	    	this.novaMasina.GPUJezgra = this.novaMasina.kategorija.GPUJezgra;
	    },
	},
	mounted () {
		axios
        .get('ucitajOrganizacije')
        .then(response => (this.organizacije = response.data))
        .catch(function (error) { console.log(error); });
		axios
        .get('ucitajKategorije')
        .then(response => (this.kategorije= response.data))
        .catch(function (error) { console.log(error); });
	}
});