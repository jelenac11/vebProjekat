Vue.component("organizacije", {
	data: function () {
	    return {
	    	ulogovan : {
	    		email : "",
	    		lozinka : "",
	    		ime : "",
	    		prezime : "",
	    		organizacija : null,
	    		uloga : null
	    	},
	    	organizacije : [],
	    	korisnici : [],
	    	masine : [],
	    	diskovi : [],
	    	izabranaOrganizacija : {},
	    	novaOrganizacija : {},
	    	submitovano : false,
	    	uspesnaIzmena : true,
	    	korisniciOrganizacije : [],
    	}
	},
	template: `
<div>
	<nav class="navbar navbar-expand-md navbar-dark bg-dark">
	    <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
	        <ul class="nav nav-pills" role="tablist">
				<li class="nav-item">
					<router-link :to="{ path: 'virtuelnemasine'}" data-toggle="pill" class="nav-link">Virtuelne mašine</router-link>
				</li>
				<li class="nav-item">
					<router-link :to="{ path: 'diskovi'}" data-toggle="pill" class="nav-link">Diskovi</router-link>
				</li>
				<li class="nav-item">
					<router-link :to="{ path: 'kategorije'}" data-toggle="pill" class="nav-link">kategorije</router-link>
				</li>
			 	<li class="nav-item">
			 		<router-link :to="{ path: 'organizacije'}" data-toggle="pill" class="nav-link active">Organizacije</router-link>
				</li>
			  	<li class="nav-item">
			  		<router-link :to="{ path: 'korisnici'}" data-toggle="pill" class="nav-link">Korisnici</router-link>
				</li>
			</ul>
	    </div>
	    
	    <div class="navbar-collapse collapse w-100 order-1 dual-collapse2">
	        <ul class="navbar-nav ml-auto">
	            <li class="nav-item dropdown">
	                <a class="navbar-brand dropdown-toggle" href="#" data-toggle="dropdown">
					    <img src="profilepic.png" width="30" height="30" class="d-inline-block align-top" alt="">
					    {{ this.ulogovan.ime + " " + this.ulogovan.prezime }}
				  	</a>
				  	<div class="dropdown-menu">
				  		<a class="dropdown-item" data-toggle="modal" data-target="#profilModal" href='#'>Pregled profila</a>
			        	<a class="dropdown-item" v-on:click="logout" href="#">Odjavi se</a>
			        </div>
	            </li>
	        </ul>
	    </div>
	</nav>
	
	<div class="modal fade" id="profilModal" tabindex="-1" role="dialog">
		<div class="modal-dialog" role="document">
	    	<div class="modal-content">
				<div class="modal-header">
	        		<h5 class="modal-title" id="exampleModalLabel">Pregled profila</h5>
	        		<button type="button" class="close" data-dismiss="modal">
	          			<span>&times;</span>
	        		</button>
	      		</div>
	      		<div class="modal-body">
	        		<ul class="list-group">
					  	<li class="list-group-item">
					  		<div class="d-flex w-20 justify-content-between">
						  		<h6>Email adresa:</h6>
						  		<p class="mb-0">{{ this.ulogovan.email }}</p>
						  	</div>
					  	</li>
					  	<li class="list-group-item">
					  		<div class="d-flex w-20 justify-content-between">
						  		<h6>Ime:</h6>
						  		<p class="mb-0">{{ this.ulogovan.ime }}</p>
						  	</div>
					  	</li>
					  	<li class="list-group-item">
					  		<div class="d-flex w-20 justify-content-between">
					  			<h6>Prezme:</h6>
					  			<p class="mb-0">{{ this.ulogovan.prezime }}</p>
					  		</div>
					  	</li>
					  	<li class="list-group-item">
					  		<div class="d-flex w-20 justify-content-between">
					  			<h6>Organizacija:</h6>
					  			<p class="mb-0">{{ this.ulogovan.organizacija }}</p>
					  		</div>
					  	</li>
					</ul>
	      		</div>
	      		<div class="modal-footer">
	        		<button type="button" class="btn btn-secondary mr-auto" data-dismiss="modal">Nazad</button>
	        		<router-link :to="{ path: 'izmenaProfila'}" class="btn btn-primary" data-dismiss="modal">Izmena podataka</router-link>
	      		</div>
	    	</div>
		</div>
	</div>
	
	<div class="tab-content">
		<div class="tab-pane fade show active" id="pills-organizacije" role="tabpanel">
			<table class="table table-hover table-striped">
			  	<thead class="thead-light">
			    	<tr>
				      	<th scope="col" width="5%">Logo</th>
				      	<th scope="col" width="25%">Ime</th>
				      	<th scope="col" width="70%">Opis</th>
			    	</tr>
			  	</thead>
			  	<tbody>
			  		<tr v-for="o in organizacije" data-toggle="modal" data-target="#izmenaOrgModal" v-on:click="izaberiOrg(o)">
				      	<td width="5%""><img v-bind:src="o.logoPutanja" width="30" height="30" class="d-inline-block align-top" alt=""></td>
				      	<td width="25%">{{ o.ime }}</td>
				      	<td width="70%">{{ o.opis }}</td>
			    	</tr>
			  	</tbody>
			</table>
			<router-link :to="{ path: 'dodavanjeOrganizacije'}" class="btn btn-primary btn-block btn-lg my-2 p-2" id="dodavanjeOrg">Dodaj organizaciju</router-link>
		</div>
	</div>
	
	<div class="modal fade" id="izmenaOrgModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg" role="document">
	    	<div class="modal-content">
	      		<div class="modal-header">
	        		<h5 class="modal-title">Podaci o organizaciji</h5>
	        		<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
	      		</div>
	      		<div class="modal-body">
	        		<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="izmenaOrg" id="forma-izmena-org">
					  	<div class="form-row mb-3">
					  		<div class="col">
					    	 	<label for="imeorg">Ime organizacije</label>
								<input type="text" v-model="novaOrganizacija.ime" class="form-control" id="imeorg" placeholder="Ime organizacije" required>
								<div class="invalid-feedback" id="izmenaInvalid">Niste uneli ime.</div>
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
					  	<div class="form-row">
					    	<div class="col">
					    		<label class="mt-3" for="tabelaKorisnika">Korisnici</label>
					    		<table class="table table-hover" id="tabelaKorisnika">
								  	<thead>
								    	<tr>
								      		<th scope="col">Email</th>
								      		<th scope="col">Ime</th>
									        <th scope="col">Prezime</th>
									        <th scope="col">Uloga</th>
								    	</tr>
								  	</thead>
								  	<tbody>
								    	<tr v-for="k in korisniciOrganizacije">
									        <td>{{ k.email }}</td>
									        <td>{{ k.ime }}</td>
									        <td>{{ k.prezime }}</td>
									        <td>{{ k.uloga }}</td>
										</tr>
								  	</tbody>
								</table>
							</div>
					  	</div>
					  	<div class="form-row">
					    	<div class="col">
					    		<label class="mt-3" for="listaResursa">Resursi</label>
					    		<ul class="list-group">
								  <li v-for="resurs in novaOrganizacija.resursi" class="list-group-item">{{ resurs }}</li>
								</ul>
							</div>
					  	</div>
					  	<div v-if=!uspesnaIzmena class="alert alert-danger mt-4" role="alert">
							<p class="mb-0"><b>Greška!</b> Organizacija sa datim imenom već postoji.</p>
						</div>
					  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit" v-bind:disabled="izabranaOrganizacija.ime == novaOrganizacija.ime && izabranaOrganizacija.opis == novaOrganizacija.opis && izabranaOrganizacija.logoPutanja == novaOrganizacija.logoPutanja">
					  		Sačuvaj izmene
					  	</button>
					</form>
	      		</div>
	      		<div class="modal-footer">
	        		<button type="button" class="btn btn-secondary mr-auto" data-dismiss="modal">Nazad</button>
	      		</div>
	    	</div>
		</div>
	</div>
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
		izaberiOrg : function (o) {
			this.izabranaOrganizacija = JSON.parse(JSON.stringify(o));
			this.novaOrganizacija = JSON.parse(JSON.stringify(o));
			axios
			.post('korisniciOrganizacije', this.izabranaOrganizacija)
	        .then(response => (this.korisniciOrganizacije = response.data))
	        .catch(function (error) { console.log(error); });
			this.uspesnaIzmena = true;
			this.submitovano = false;
		},
		izmenaOrg : function () {
			this.submitovano = true;
			if (document.getElementById('forma-izmena-org').checkValidity() === true) {
				axios
				.post('izmeniOrg', [this.izabranaOrganizacija, this.novaOrganizacija])
				.then(response => {
					this.uspesnaIzmena = response.data;
					
					if (this.uspesnaIzmena) {
						axios
				        .get('ucitajKorisnike')
				        .then(response => (this.korisnici = response.data))
				        .catch(function (error) { console.log(error); });
						axios
				        .get('ucitajOrganizacije')
				        .then(response => (this.organizacije = response.data))
				        .catch(function (error) { console.log(error); });
						axios
				        .get('ucitajMasine')
				        .then(response => (this.masine = response.data))
				        .catch(function (error) { console.log(error); });
						axios
				        .get('ucitajDiskove')
				        .then(response => (this.diskovi = response.data))
				        .catch(function (error) { console.log(error); });
						
						toast("Uspešno izmenjena organizacija.");
						$("#izmenaOrgModal .close").click();
						this.submitovano = false;
					}
				})
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesnaIzmena = true;
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
	    },
	},
	mounted () {
		axios
        .get('ulogovan')
        .then(response => (this.ulogovan = response.data))
        .catch(function (error) { console.log(error); });
		axios
        .get('ucitajOrganizacije')
        .then(response => (this.organizacije = response.data))
        .catch(function (error) { console.log(error); });
		axios
		.get('ucitajKorisnike')
        .then(response => (this.korisnici = response.data))
        .catch(function (error) { console.log(error); });
		axios
		.get('ucitajMasine')
        .then(response => (this.masine = response.data))
        .catch(function (error) { console.log(error); });
		axios
		.get('ucitajDiskove')
        .then(response => (this.diskovi = response.data))
        .catch(function (error) { console.log(error); });
	}
});