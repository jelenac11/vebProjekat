Vue.component("dodavanje-diska", {
	data: function () {
	    return {
	    	noviDisk : {
	    		ime: "",
	    		tip: "",
	    		kapacitet: 0,
	    		virtuelnaMasina: "",
	    	},
	    	organizacije : [],
	    	masineIzIsteOrg : [],
	    	submitovano : false,
	    	uspesnoDodavanje : true,
    	}
	},
	template: `
<div class="container d-flex justify-content-center">
	<div class="card mt-5" style="width: 47rem;">
		<h4 class="card-header">Dodavanje kategorije</h4>
		<div class="card-body">
			<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="dodajDisk" id="forma-dodaj-disk">
			  	<div class="form-row mb-3">
			  		<div class="col">
			    	 	<label for="imedisk">Ime diska</label>
						<input type="text" v-model="noviDisk.ime" class="form-control" id="imedisk" placeholder="Ime diska" required>
						<div class="invalid-feedback" id="dodavanjeInvalid">Niste uneli ime.</div>
					</div>
				</div>
			  	<div class="form-row">
			    	<div class="col">
			    	 	<label for="tipd">Tip diska</label>
						<select class="custom-select mt-0" v-model="noviDisk.tip" id="tipd" required>
					    	<option value="HDD">HDD</option>
					    	<option value="SSD">SSD</option>
					  	</select>
			    		<div class="invalid-feedback" id="dodavanjeInvalid">Niste odabrali tip.</div>
					</div>
					<div class="col">
			    	 	<label for="kap">Kapacitet</label>
						<input type="number" v-model="noviDisk.kapacitet" min="0" class="form-control" id="kap" placeholder="Kapacitet" required>
						<div class="invalid-feedback" id="dodavanjeInvalid">Unesite ispravno kapacitet diska.</div>
					</div>
			  	</div>
			  	<div class="form-row">
			    	<div class="col">
						<label for="vmdisk" class="mt-1">Virtuelna mašina</label>
						<select class="custom-select mt-0" v-model="noviDisk.virtuelnaMasina" id="vmdisk">
					    	<option v-for="vm in masineIzIsteOrg" :value="vm.ime">
								{{ vm.ime }}
					    	</option>
					    	<option value="">
								Nema
					    	</option>
					  	</select>
					</div>
			  	</div>
			  	<div class="form-row">
			    	<div class="col">
						<label for="orgdisk" class="mt-1">Organizacija</label>
						<select class="custom-select mt-0" v-model="noviDisk.organizacija" v-on:change="postaviMasine" id="orgdisk" required>
					    	<option v-for="org in organizacije" :value="org.ime">
								{{ org.ime }}
					    	</option>
						</select>
					</div>
			  	</div>
			  	<div v-if=!uspesnoDodavanje class="alert alert-danger mt-4" role="alert">
					<p class="mb-0"><b>Greška!</b> Ime je zauzeto.</p>
				</div>
			  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit">
			  		Dodaj disk
			  	</button>
			</form>
			<router-link :to="{ path: 'superadmin' }" class="btn btn-secondary">Nazad</router-link>
		</div>
	</div>
</div>	
`
	,
	methods : {
		dodajDisk : function () {
			this.submitovano = true;
			if (document.getElementById('forma-dodaj-disk').checkValidity() === true) {
				axios
				.post('dodajDisk', this.noviDisk)
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
		postaviMasine : function () {
			axios
	        .post('masineIzIsteOrg', this.noviDisk)
	        .then(response => (this.masineIzIsteOrg = response.data))
	        .catch(function (error) { console.log(error); });
		}
	},
	mounted () {
		axios
        .get('ucitajOrganizacije')
        .then(response => (this.organizacije = response.data))
        .catch(function (error) { console.log(error); });
	}
});