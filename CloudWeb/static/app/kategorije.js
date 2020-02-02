Vue.component("kategorije", {
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
	    	kategorije : [],
	    	izabranaKategorija : {},
	    	novaKategorija : {},
	    	submitovano : false,
	    	uspesnaIzmena : true,
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
					<router-link :to="{ path: 'kategorije'}" data-toggle="pill" class="nav-link active">Kategorije</router-link>
				</li>
			 	<li v-if="this.ulogovan.uloga != 'KORISNIK'" class="nav-item">
			 		<router-link :to="{ path: 'organizacije'}" data-toggle="pill" class="nav-link">Organizacije</router-link>
				</li>
			  	<li v-if="this.ulogovan.uloga != 'KORISNIK'" class="nav-item">
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
		<div class="tab-pane fade show active" id="pills-kategorije" role="tabpanel" >
			<table class="table table-hover table-striped">
			  	<thead class="thead-light">
			    	<tr>
				      	<th scope="col" width="36%">Ime</th>
						<th scope="col" width="18%">Broj jezgara</th>
				      	<th scope="col" width="18%">RAM</th>
				      	<th scope="col" width="18%">GPU jezgra</th>
				      	<th scope="col" width="10%"></th>
			    	</tr>
			  	</thead>
			  	<tbody>
			  		<tr v-for="kat in kategorije" data-toggle="modal" data-target="#izmenaKatModal" v-on:click="izaberiKat(kat)">
				      	<td width="36%">{{ kat.ime }}</td>
				      	<td width="18%">{{ kat.brojJezgara }}</td>
				      	<td width="18%">{{ kat.RAM }}</td>
				      	<td width="18%">{{ kat.GPUJezgra }}</td>
				      	<td width="10%"><button class="btn btn-danger btn-sm" v-on:click="obrisiKategoriju(kat)">Ukloni</button></td>
			    	</tr>
			  	</tbody>
			</table>
			<router-link :to="{ path: 'dodavanjeKategorije'}" class="btn btn-primary btn-block btn-lg my-2 p-2" id="dodavanjeKat">Dodaj kategorije</router-link>
		</div>
	</div>
	
	<div class="modal fade" id="izmenaKatModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg" role="document">
	    	<div class="modal-content">
	      		<div class="modal-header">
	        		<h5 class="modal-title">Podaci o kategoriji</h5>
	        		<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
	      		</div>
	      		<div class="modal-body">
	        		<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="izmenaKat" id="forma-izmena-kat">
					  	<div class="form-row mb-3">
					  		<div class="col">
					    	 	<label for="imekat">Ime kategorije</label>
								<input type="text" v-model="novaKategorija.ime" class="form-control" id="imekat" placeholder="Ime kategorije" required>
								<div class="invalid-feedback" id="izmenaInvalid">Niste uneli ime.</div>
							</div>
						</div>
					  	<div class="form-row">
					    	<div class="col">
					    	 	<label for="brjez">Broj jezgara</label>
								<input type="number" v-model="novaKategorija.brojJezgara" min="1" class="form-control" id="brjez" placeholder="Broj jezgara" required>
								<div class="invalid-feedback" id="izmenaInvalid">Niste uneli broj jezgara.</div>
							</div>
							<div class="col">
					    	 	<label for="ram">RAM</label>
								<input type="number" v-model="novaKategorija.RAM" min="1" class="form-control" id="ram" placeholder="RAM" required>
								<div class="invalid-feedback" id="izmenaInvalid">Niste uneli RAM.</div>
							</div>
							<div class="col">
					    	 	<label for="gpu">GPU jezgra</label>
								<input type="number" v-model="novaKategorija.GPUJezgra" min="0" step=".1" class="form-control" id="gpu" placeholder="GPU jezgra">
								<div class="invalid-feedback" id="izmenaInvalid">Niste uneli GPU jezgra.</div>
							</div>
					  	</div>
					  	<div v-if=!uspesnaIzmena class="alert alert-danger mt-4" role="alert">
							<p class="mb-0"><b>Greška!</b> Ime je zauzeto.</p>
						</div>
					  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit" v-bind:disabled="izabranaKategorija.ime == novaKategorija.ime && izabranaKategorija.brojJezgara == novaKategorija.brojJezgara && izabranaKategorija.RAM == novaKategorija.RAM && izabranaKategorija.GPUJezgra == novaKategorija.GPUJezgra">
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
		izaberiKat: function (kat) {
			this.izabranaKategorija = JSON.parse(JSON.stringify(kat));
			this.novaKategorija = JSON.parse(JSON.stringify(kat));
			this.uspesnaIzmena = true;
			this.submitovano = false;
		},
		izmenaKat : function () {
			this.submitovano = true;
			if (document.getElementById('forma-izmena-kat').checkValidity() === true) {
				axios
				.post('izmeniKat', [this.izabranaKategorija, this.novaKategorija])
				.then(response => {
					this.uspesnaIzmena = response.data;
					
					if (this.uspesnaIzmena) {
						toast("Uspešno izmenjena kategorija.");
						this.$router.go();
					}
				})
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesnaIzmena = true;
			}
		},
		obrisiKategoriju : function (kat) {
			var hoceDaBrise = confirm("Da li stvarno želite da uklonite ovu kategoriju?");
			if (hoceDaBrise == true) {
				axios
				.post('obrisiKategoriju', kat)
				.then(response => {
					if (!response.data) {
						alert("Ne možete ukloniti ovu kategoriju jer ona ima dodeljene virtuelne mašine.");
					} else {
						toast("Uspešno uklonjena kategorija.");
						this.$router.go();
					}
				})
				.catch(function (error) { console.log(error); });
			}
			this.$router.go();
		},
	},
	mounted () {
		axios
        .get('ulogovan')
        .then(response => (this.ulogovan = response.data))
        .catch(function (error) { console.log(error); });
		axios
		.get('ucitajKategorije')
        .then(response => (this.kategorije = response.data))
        .catch(function (error) { console.log(error); });
	}
});