Vue.component("diskovi", {
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
	    	masine : [],
	    	diskovi : [],
	    	izabraniDisk : {},
	    	noviDisk : {},
	    	submitovano : false,
	    	uspesnaIzmena : true,
	    	kapacFilter : false,
	    	kapDonja : 0,
	    	kapGornja : 0,
	    	masineIzIsteOrg : [],
	    	diskoviIzIsteOrg : [],
	    	pretragaDisk : "",
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
					<router-link :to="{ path: 'diskovi'}" data-toggle="pill" class="nav-link active">Diskovi</router-link>
				</li>
				<li v-if="this.ulogovan.uloga == 'SUPER_ADMIN'" class="nav-item">
					<router-link :to="{ path: 'kategorije'}" data-toggle="pill" class="nav-link">Kategorije</router-link>
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
		<div class="tab-pane fade show active" id="pills-diskovi" role="tabpanel" >
			<div class="input-group">
			  	<span class="input-group-btn">
			    	<a class="btn btn-secondary m-2" data-toggle="collapse" href="#filteriDisk" role="button">
				    	Prikaži filtere
				  	</a>
			  	</span>
				<input type="search" class="form-control col-4 ml-auto m-2" v-model="pretragaDisk" id="pretdisk" placeholder="Pretraži.."/>
			</div>
			<div class="collapse" id="filteriDisk">
		  		<div class="card card-body m-2">
		    		<form>
					  	<div class="form-row mb-4">
					  		<div class="mt-5 mr-3 custom-control custom-checkbox">
					  			<input type="checkbox" class="custom-control-input" id="kapac" v-model="kapacFilter">
					  			<label class="custom-control-label" for="kapac"><font size="4">Kapacitet</font></label>
							</div>
					  		<div class="col-2 mt-1">
					    	 	<label for="odkap">Od</label>
								<input type="number" v-model="kapDonja" class="form-control" id="odkap" placeholder="Od">
							</div>
							<div class="col-2 mt-1">
					    	 	<label for="dokap">Do</label>
								<input type="number" v-model="kapGornja" class="form-control" id="dokap" placeholder="Do">
							</div>
						</div>
					</form>
		  		</div>
			</div>
			<table class="table table-hover table-striped">
			  	<thead class="thead-light">
			    	<tr>
				      	<th scope="col" width="20%">Ime</th>
						<th scope="col" width="15%">Tip</th>
				      	<th scope="col" width="15%">Kapacitet</th>
				      	<th scope="col" width="20%">Virtuelna mašina</th>
				      	<th scope="col" width="20%">Organizacija</th>
				      	<th scope="col" width="10%"></th>
			    	</tr>
			  	</thead>
			  	<tbody>
			  		<tr v-for="d in filtriraniDiskovi" data-toggle="modal" data-target="#izmenaDiskModal" v-on:click="izaberiDisk(d)">
				      	<td width="20%">{{ d.ime }}</td>
				      	<td width="15%">{{ d.tip }}</td>
				      	<td width="15%">{{ d.kapacitet }}</td>
				      	<td width="20%">{{ d.virtuelnaMasina }}</td>
				      	<td width="20%">{{ d.organizacija }}</td>
				      	<td width="10%"><button class="btn btn-danger btn-sm" v-if="ulogovan.uloga != 'KORISNIK'" v-on:click="obrisiDisk(d)">Ukloni</button></td>
			    	</tr>
			  	</tbody>
			</table>
			<router-link :to="{ path: 'dodavanjeDiska'}" v-if="this.ulogovan.uloga != 'KORISNIK'" class="btn btn-primary btn-block btn-lg my-2 p-2" id="dodavanjeDiska">Dodaj disk</router-link>
		</div>
	</div>
	
	<div class="modal fade" id="izmenaDiskModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg" role="document">
	    	<div class="modal-content">
	      		<div class="modal-header">
	        		<h5 class="modal-title">Podaci o disku</h5>
	        		<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
	      		</div>
	      		<div class="modal-body">
	        		<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="izmenaDisk" id="forma-izmena-disk">
					  	<div class="form-row mb-3">
					  		<div class="col">
					    	 	<label for="imedisk">Ime diska</label>
								<input type="text" v-model="noviDisk.ime" class="form-control" id="imedisk" placeholder="Ime diska" required v-bind:disabled="this.ulogovan.uloga == 'KORISNIK'">
								<div class="invalid-feedback" id="izmenaInvalid">Niste uneli ime.</div>
							</div>
						</div>
					  	<div class="form-row">
					    	<div class="col">
					    	 	<label for="tipd">Tip diska</label>
								<select class="custom-select mt-0" v-model="noviDisk.tip" id="tipd" required v-bind:disabled="this.ulogovan.uloga == 'KORISNIK'">
							    	<option value="HDD">HDD</option>
							    	<option value="SSD">SSD</option>
							  	</select>
					    		<div class="invalid-feedback" id="izmenaInvalid">Niste odabrali tip.</div>
							</div>
							<div class="col">
					    	 	<label for="kap">Kapacitet</label>
								<input type="number" v-model="noviDisk.kapacitet" min="0" class="form-control" id="kap" placeholder="Kapacitet" required v-bind:disabled="this.ulogovan.uloga == 'KORISNIK'">
								<div class="invalid-feedback" id="izmenaInvalid">Unesite ispravno kapacitet diska.</div>
							</div>
					  	</div>
					  	<div class="form-row">
					    	<div class="col">
								<label for="vmdisk" class="mt-1">Virtuelna mašina</label>
								<select class="custom-select mt-0" v-model="noviDisk.virtuelnaMasina" id="vmdisk" v-bind:disabled="this.ulogovan.uloga == 'KORISNIK'">
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
								<select class="custom-select mt-0" v-model="noviDisk.organizacija" v-on:change="postaviMasine" id="orgdisk" disabled required v-bind:disabled="this.ulogovan.uloga == 'KORISNIK'">
							    	<option v-for="org in organizacije" :value="org.ime">
										{{ org.ime }}
							    	</option>
								</select>
							</div>
					  	</div>
					  	<div v-if=!uspesnaIzmena class="alert alert-danger mt-4" role="alert">
							<p class="mb-0"><b>Greška!</b> Ime je zauzeto.</p>
						</div>
					  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit" v-bind:disabled="izabraniDisk.ime == noviDisk.ime && izabraniDisk.tip == noviDisk.tip && izabraniDisk.kapacitet == noviDisk.kapacitet && izabraniDisk.virtuelnaMasina == noviDisk.virtuelnaMasina && izabraniDisk.organizacija == noviDisk.organizacija">
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
		izaberiDisk: function (d) {
			this.izabraniDisk = JSON.parse(JSON.stringify(d));
			this.noviDisk = JSON.parse(JSON.stringify(d));
			axios
			.post('masineIzIsteOrg', this.izabraniDisk)
	        .then(response => (this.masineIzIsteOrg = response.data))
	        .catch(function (error) { console.log(error); });
			this.uspesnaIzmena = true;
			this.submitovano = false;
		},
		izmenaDisk : function () {
			this.submitovano = true;
			if (document.getElementById('forma-izmena-disk').checkValidity() === true) {
				axios
				.post('izmeniDisk', [this.izabraniDisk, this.noviDisk])
				.then(response => {
					this.uspesnaIzmena = response.data;
					
					if (this.uspesnaIzmena) {
						toast("Uspešno izmenjen disk.");
						this.$router.go();
					}
				})
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesnaIzmena = true;
			}
		},
		obrisiDisk : function (d) {
			var hoceDaBrise = confirm("Da li stvarno želite da uklonite ovaj disk?");
			if (hoceDaBrise == true) {
				axios
				.post('obrisiDisk', d)
				.then(response => {
					toast("Uspešno uklonjen disk.");
					this.$router.go();
				})
				.catch(function (error) { console.log(error); });
			}
			this.$router.go();
		},
	    postaviMasine : function () {
			axios
	        .post('masineIzIsteOrg', this.noviDisk)
	        .then(response => (this.masineIzIsteOrg = response.data))
	        .catch(function (error) { console.log(error); });
		},
		zadovoljavaKapacitet : function (disk) {
	    	if (this.kapacFilter) {
	    		if (disk.kapacitet >= this.kapDonja && disk.kapacitet <= this.kapGornja) {
	    			return true;
	    		} else {
	    			return false;
	    		}
	    	} else {
	    		return true;
	    	}
		},
	},
	computed: {
	    filtriraniDiskovi : function () {
	    	return this.diskovi.filter(disk => {
	    	  return disk.ime.toLowerCase().includes(this.pretragaDisk.toLowerCase()) && this.zadovoljavaKapacitet(disk);
	      	})
	    }
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
		.get('ucitajMasine')
        .then(response => {
			masinice = response.data;
			if (this.ulogovan.uloga == "ADMIN" || this.ulogovan.uloga == "KORISNIK") {
				mojOrgan = this.ulogovan.organizacija;
				this.masine = masinice.filter(function(mas) {
					return mas.organizacija == mojOrgan;
				})
			} else if (this.ulogovan.uloga == "SUPER_ADMIN") {
				this.masine = masinice;
			}
		})
        .catch(function (error) { console.log(error); });
		axios
		.get('ucitajDiskove')
        .then(response => {
			diskici = response.data;
			if (this.ulogovan.uloga == "ADMIN" || this.ulogovan.uloga == "KORISNIK") {
				mojOrgan = this.ulogovan.organizacija;
				this.diskovi = diskici.filter(function(dis) {
					return dis.organizacija == mojOrgan;
				})
			} else if (this.ulogovan.uloga == "SUPER_ADMIN") {
				this.diskovi = diskici;
			}
		})
        .catch(function (error) { console.log(error); });
	}
});