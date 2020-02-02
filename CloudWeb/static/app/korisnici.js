Vue.component("korisnici", {
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
	    	korisnici : [],
	    	organizacije : [],
	    	izabraniKorisnik : {},
	    	noviKorisnik : {},
	    	submitovano : false,
	    	uspesnaIzmena : true,
	    	potvrdaLozinke : "",
	    	poklapajuSeLozinke : true,
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
				<li v-if="this.ulogovan.uloga == 'SUPER_ADMIN'" class="nav-item">
					<router-link :to="{ path: 'kategorije'}" data-toggle="pill" class="nav-link">Kategorije</router-link>
				</li>
			 	<li v-if="this.ulogovan.uloga != 'KORISNIK'" class="nav-item">
			 		<router-link :to="{ path: 'organizacije'}" data-toggle="pill" class="nav-link">Organizacije</router-link>
				</li>
			  	<li v-if="this.ulogovan.uloga != 'KORISNIK'" class="nav-item">
			  		<router-link :to="{ path: 'korisnici'}" data-toggle="pill" class="nav-link active">Korisnici</router-link>
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
		<div class="tab-pane fade show active" id="pills-korisnici" role="tabpanel">
			<table class="table table-hover table-striped">
			  	<thead class="thead-light">
			    	<tr>
				      	<th scope="col" width="25%">Email</th>
				      	<th scope="col" width="15%">Ime</th>
				      	<th scope="col" width="15%">Prezime</th>
				      	<th scope="col" width="20%">Organizacija</th>
				      	<th scope="col" width="15%">Uloga</th>
				      	<th scope="col" width="10%"></th>
			    	</tr>
			  	</thead>
			  	<tbody>
			  		<tr v-for="k in korisnici" data-toggle="modal" data-target="#izmenaKorisnikaModal" v-on:click="izaberiKor(k)">
				      	<td width="25%">{{ k.email }}</td>
				      	<td width="15%">{{ k.ime }}</td>
				      	<td width="15%">{{ k.prezime }}</td>
				      	<td width="20%">{{ k.organizacija }}</td>
				      	<td width="15%">{{ k.uloga }}</td>
				      	<td width="10%"><button v-if="ulogovan.email != k.email" class="btn btn-danger btn-sm" v-on:click="obrisiKorisnika(k)">Ukloni</button></td>
			    	</tr>
			  	</tbody>
			</table>
			<router-link :to="{ path: 'dodavanjeKorisnika'}" class="btn btn-primary btn-block btn-lg my-2 p-2" id="dodavanjeKor">Dodaj korisnika</router-link>
		</div>
	</div>
	
	<div class="modal fade" id="izmenaKorisnikaModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg" role="document">
	    	<div class="modal-content">
	      		<div class="modal-header">
	        		<h5 class="modal-title">Podaci o korisniku</h5>
	        		<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
	      		</div>
	      		<div class="modal-body">
	        		<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="izmenaKor" id="forma-izmena-kor">
					  	<div class="form-row mb-3">
					  		<div class="col">
					    	 	<label for="email">Email adresa</label>
								<input type="email" v-model="noviKorisnik.email" class="form-control" id="email" placeholder="Email adresa" disabled required>
							</div>
						</div>
						<div class="form-row">
					    	<div class="col">
					    	 	<label for="lozinka1">Lozinka</label>
								<input type="password" minlength="8" maxlength="20" v-model="noviKorisnik.lozinka" class="form-control" id="lozinka1" placeholder="Lozinka" required>
								<small id="passwordHelpBlock" class="form-text text-muted">
								  	Lozinka mora imati 8-20 karaktera.
								</small>
								<div class="invalid-feedback" id="izmenaInvalid">Neodgovarajuća dužina lozinke.</div>
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
								<div class="invalid-feedback" id="izmenaInvalid">Niste uneli ime.</div>
							</div>
					    	<div class="col">
					    		<label for="prezime" class="mt-1">Prezime</label>
								<input type="text" v-model="noviKorisnik.prezime" class="form-control" id="prezime" placeholder="Prezime" required>
					    		<div class="invalid-feedback" id="izmenaInvalid">Niste uneli prezime.</div>
					    	</div>
					    	<div class="col">
					    		<label for="uloga" class="mt-1">Uloga</label>
					    		<select class="custom-select mt-0" v-model="noviKorisnik.uloga" id="uloga" required>
							    	<option value="ADMIN">Admin</option>
							    	<option value="KORISNIK">Korisnik</option>
							  	</select>
					    		<div class="invalid-feedback" id="izmenaInvalid">Niste odabrali ulogu.</div>
					    	</div>
					  	</div>
					  	<div class="form-row">
					    	<div class="col">
					    		<label for="organ" class="mt-1">Organizacija</label>
								<select class="custom-select mt-0" v-model="noviKorisnik.organizacija" id="organ" disabled required>
							    	<option v-for="org in organizacije" :value="org.ime">
										{{ org.ime }}
							    	</option>
							  	</select>
							</div>
					  	</div>
					  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit" v-bind:disabled="izabraniKorisnik.ime == noviKorisnik.ime && izabraniKorisnik.prezime == noviKorisnik.prezime && izabraniKorisnik.uloga == noviKorisnik.uloga && izabraniKorisnik.lozinka == noviKorisnik.lozinka">
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
		izaberiKor: function (k) {
			this.izabraniKorisnik = JSON.parse(JSON.stringify(k));
			this.noviKorisnik = JSON.parse(JSON.stringify(k));
			this.uspesnaIzmena = true;
			this.submitovano = false;
		},
		izmenaKor : function () {
			this.proveriLozinke();
			this.submitovano = true;
			if (document.getElementById('forma-izmena-kor').checkValidity() === true && this.poklapajuSeLozinke) {
				axios
				.post('izmeniKor', [this.izabraniKorisnik, this.noviKorisnik])
				.then(response => {
					this.uspesnaIzmena = response.data;
					
					if (this.uspesnaIzmena) {
						toast("Uspešno izmenjen korisnik.");
						this.$router.go();
					}
				})
				.catch(error => {
					console.log(error);
					this.uspesnaIzmena = false;
				});
			} else {
				this.uspesnaIzmena = true;
			}
		},
		obrisiKorisnika : function (k) {
			if (confirm("Da li stvarno želite da uklonite ovog korisnika?")) {
				axios
				.post('obrisiKorisnika', k)
				.then(response => {
					toast("Uspešno uklonjen korisnik.");
					this.$router.go();
				})
				.catch(function (error) { console.log(error); });
			}
			$("#izmenaKorisnikaModal .close").click();
		},
		proveriLozinke : function () {
			if (this.noviKorisnik.lozinka != this.potvrdaLozinke) {
				this.poklapajuSeLozinke = false;
			} else {
				this.poklapajuSeLozinke = true;
			}
		},
	},
	mounted () {
		axios
        .get('ulogovan')
        .then(response => (this.ulogovan = response.data))
        .catch(function (error) { console.log(error); });
		axios
		.get('ucitajKorisnike')
        .then(response => {
			korisni = response.data;
			if (this.ulogovan.uloga == "ADMIN") {
				mojaOrgan = this.ulogovan.organizacija;
				this.korisnici = korisni.filter(function(kor) {
					return kor.organizacija == mojaOrgan;
				})
			} else if (this.ulogovan.uloga == "SUPER_ADMIN") {
				this.korisnici = korisni;
			}
		})
        .catch(function (error) { console.log(error); });
		axios
		.get('ucitajOrganizacije')
        .then(response => (this.organizacije = response.data))
        .catch(function (error) { console.log(error); });
	}
});
