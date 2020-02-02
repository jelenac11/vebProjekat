Vue.component("dodavanje-organizacije", {
	data: function () {
	    return {
	    	novaOrganizacija : {
	    		ime: "",
	    		opis: "",
	    		logoPutanja: "",
	    		korisnici: [],
	    		resursi: []
	    	},
	    	submitovano : false,
	    	uspesnoDodavanje : true,
    	}
	},
	template: `
<div class="container d-flex justify-content-center">
	<div class="card mt-5" style="width: 47rem;">
		<h4 class="card-header">Dodavanje organizacije</h4>
		<div class="card-body">
			<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="dodajOrg" id="forma-dodaj-org">
			  	<div class="form-row mb-3">
			  		<div class="col">
			    	 	<label for="ime">Ime organizacije</label>
						<input type="text" v-model="novaOrganizacija.ime" class="form-control" id="ime" placeholder="Ime organizacije" required>
						<div class="invalid-feedback" id="dodavanjeInvalid">Niste uneli ime.</div>
					</div>
				</div>
			  	<div class="form-row">
			    	<div class="col">
			    	 	<label for="opis">Opis</label>
						<textarea v-model="novaOrganizacija.opis" class="form-control" id="opis" placeholder="Opis" rows="3"></textarea>
					</div>
			  	</div>
			  	<div class="form-row">
			    	<div class="col">
			    		<img v-bind:src="novaOrganizacija.logoPutanja" class="m-2" alt="" height="62" width="62">
				    	<div class="custom-file">
						  	<input type="file" v-on:change="promeniSliku" class="custom-file-input" accept="image/*" id="logoOrg">
						  	<label class="custom-file-label" for="logoOrg">Izaberi logo...</label>
						</div>
					</div>
			  	</div>
			  	<div v-if=!uspesnoDodavanje class="alert alert-danger mt-4" role="alert">
					<p class="mb-0"><b>Greška!</b> Organizacija sa datim imenom već postoji.</p>
				</div>
			  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit">
			  		Dodaj organizaciju
			  	</button>
			</form>
			<router-link :to="{ path: 'organizacije' }" class="btn btn-secondary">Nazad</router-link>
		</div>
	</div>
</div>	
`
	,
	methods : {
		dodajOrg : function () {
			this.submitovano = true;
			if (document.getElementById('forma-dodaj-org').checkValidity() === true) {
				if (this.novaOrganizacija.logoPutanja == "") {
					this.novaOrganizacija.logoPutanja = "no-image.png";
				}
				axios
				.post('dodajOrg', this.novaOrganizacija)
				.then(response => {
					this.uspesnoDodavanje = response.data;
					
					if (this.uspesnoDodavanje) {
						this.$router.replace({ path: 'organizacije' });
					}
				})
				.catch(error => {
					console.log(error);
					this.uspesnoDodavanje = false;
				})
			} else {
				this.uspesnoDodavanje = true;
			}
		},
		promeniSliku(e) {
			var files = e.target.files || e.dataTransfer.files;
			if (!files.length)
				return;
			this.kreirajSliku(files[0]);
	    },
	    kreirajSliku(file) {
	        var image = new Image();
	        var reader = new FileReader();
	        var vm = this;

	        reader.onload = (e) => {
	        	vm.novaOrganizacija.logoPutanja = e.target.result;
	        };
	        reader.readAsDataURL(file);
	        
	        var fullPath = document.getElementById('logoOrg').value;
	        if (fullPath) {
	            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
	            var filename = fullPath.substring(startIndex);
	            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
	                filename = filename.substring(1);
	            }
	            this.novaOrganizacija.logoPutanja = filename;
	        }
	    }
	}
});