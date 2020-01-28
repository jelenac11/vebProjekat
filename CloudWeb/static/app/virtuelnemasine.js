Vue.component("virtuelne-masine", {
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
	    	kategorije : [],
	    	masine : [],
	    	diskovi : [],
	    	izabranaMasina : {},
	    	novaMasina : {},
	    	submitovano : false,
	    	uspesnaIzmena : true,
	    	istaJeKategorija : true,
	    	brjezFilter : false,
	    	brjezDonja : 0,
	    	brjezGornja : 0,
	    	ramFilter : false,
	    	ramDonja : 0,
	    	ramGornja : 0,
	    	gpuFilter : false,
	    	gpuDonja : 0,
	    	gpuGornja : 0,
	    	masineIzIsteOrg : [],
	    	diskoviIzIsteOrg : [],
	    	pretragaMasina : "",
    	}
	},
	template: `
<div>
	<nav class="navbar navbar-expand-md navbar-dark bg-dark">
	    <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
	        <ul class="nav nav-pills" role="tablist">
				<li class="nav-item">
					<router-link :to="{ path: 'virtuelnemasine'}" data-toggle="pill" class="nav-link active">Virtuelne mašine</router-link>
				</li>
				<li class="nav-item">
					<router-link :to="{ path: 'diskovi'}" data-toggle="pill" class="nav-link">Diskovi</router-link>
				</li>
				<li class="nav-item">
					<router-link :to="{ path: 'kategorije'}" data-toggle="pill" class="nav-link">kategorije</router-link>
				</li>
			 	<li class="nav-item">
			 		<router-link :to="{ path: 'organizacije'}" data-toggle="pill" class="nav-link">Organizacije</router-link>
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
		<div class="tab-pane fade show active" id="pills-vm" role="tabpanel" >
			<div class="input-group">
			  	<span class="input-group-btn">
			    	<a class="btn btn-secondary m-2" data-toggle="collapse" href="#filteriMasina" role="button">
				    	Prikaži filtere
				  	</a>
			  	</span>
				<input type="search" class="form-control col-4 ml-auto m-2" v-model="pretragaMasina" id="pretmas" placeholder="Pretraži.."/>
			</div>
			<div class="collapse" id="filteriMasina">
		  		<div class="card card-body m-2">
		    		<form>
					  	<div class="form-row mb-4">
					  		<div class="mt-5 mr-3 custom-control custom-checkbox">
					  			<input type="checkbox" class="custom-control-input" id="brjezcb" v-model="brjezFilter">
					  			<label class="custom-control-label" for="brjezcb"><font size="4">Broj jezgara</font></label>
							</div>
					  		<div class="col-2 mt-1">
					    	 	<label for="odbrjez">Od</label>
								<input type="number" v-model="brjezDonja" class="form-control" id="odbrjez" placeholder="Od">
							</div>
							<div class="col-2 mt-1">
					    	 	<label for="dobrjez">Do</label>
								<input type="number" v-model="brjezGornja" class="form-control" id="dobrjez" placeholder="Do">
							</div>
						</div>
						<div class="form-row mb-4">
					  		<div class="mt-5 custom-control custom-checkbox" id="kolonaRam">
					  			<input type="checkbox" class="custom-control-input" id="ramcb" v-model="ramFilter">
					  			<label class="custom-control-label" for="ramcb"><font size="4">RAM</font></label>
							</div>
					  		<div class="col-2 mt-1">
					    	 	<label for="odram">Od</label>
								<input type="number" v-model="ramDonja" class="form-control" id="odram" placeholder="Od">
							</div>
							<div class="col-2 mt-1">
					    	 	<label for="doram">Do</label>
								<input type="number" v-model="ramGornja" class="form-control" id="doram" placeholder="Do">
							</div>
						</div>
						<div class="form-row mb-4">
					  		<div class="mt-5 mr-3 custom-control custom-checkbox" id="kolonaGpu">
					  			<input type="checkbox" class="custom-control-input" id="gpucb" v-model="gpuFilter">
					  			<label class="custom-control-label" for="gpucb"><font size="4">GPU jezgra</font></label>
							</div>
					  		<div class="col-2 mt-1">
					    	 	<label for="odgpu">Od</label>
								<input type="number" v-model="gpuDonja" class="form-control" id="odgpu" placeholder="Od">
							</div>
							<div class="col-2 mt-1">
					    	 	<label for="dogpu">Do</label>
								<input type="number" v-model="gpuGornja" class="form-control" id="dogpu" placeholder="Do">
							</div>
						</div>
					</form>
		  		</div>
			</div>
			<table class="table table-hover table-striped">
			  	<thead class="thead-light">
			    	<tr>
				      	<th scope="col" width="17%">Ime</th>
				      	<th scope="col" width="17%">Broj jezgara</th>
				      	<th scope="col" width="17%">RAM</th>
				      	<th scope="col" width="17%">GPU jezgra</th>
				      	<th scope="col" width="22%">Organizacija</th>
				      	<th scope="col" width="10%"></th>
			    	</tr>
			  	</thead>
			  	<tbody>
			  		<tr v-for="vm in filtriraneMasine" data-toggle="modal" data-target="#izmenaVMModal" v-on:click="izaberiVM(vm)">
				      	<td width="17%">{{ vm.ime }}</td>
				      	<td width="17%">{{ vm.brojJezgara }}</td>
				      	<td width="17%">{{ vm.RAM }}</td>
				      	<td width="17%">{{ vm.GPUJezgra }}</td>
				      	<td width="22%">{{ vm.organizacija }}</td>
				      	<td width="10%"><button class="btn btn-danger btn-sm" v-on:click="obrisiMasinu(vm)">Ukloni</button></td>
			    	</tr>
			  	</tbody>
			</table>
			<router-link :to="{ path: 'dodavanjeMasine'}" class="btn btn-primary btn-block btn-lg my-2 p-2" id="dodavanjeMasine">Dodaj virtuelnu mašinu</router-link>
		</div>
	</div>
	
	<div class="modal fade" id="izmenaVMModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg" role="document">
	    	<div class="modal-content">
	      		<div class="modal-header">
	        		<h5 class="modal-title">Podaci o virtuelnoj mašini</h5>
	        		<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
	      		</div>
	      		<div class="modal-body">
	        		<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="izmenaVM" id="forma-izmena-vm">
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
							  	<div class="invalid-feedback" id="izmenaInvalid">Niste izabrali kategoriju.</div>
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
								<select class="custom-select mt-0" v-model="novaMasina.organizacija" id="vmorgan" disabled required>
							    	<option v-for="org in organizacije" :value="org.ime">
										{{ org.ime }}
							    	</option>
							  	</select>
							</div>
					  	</div>
					  	<div class="form-row">
					  		<div class="col">
					    		<label for="mojiDiskovi" class="mt-3">Izaberi diskove</label>
								<ul class="list-group list-group-flush" id="mojiDiskovi">
								    <li v-for="di in diskoviIzIsteOrg" class="list-group-item">
										<div class="custom-control custom-checkbox">
								        	<input type="checkbox" v-bind:value="di.ime" v-model="novaMasina.diskovi" class="custom-control-input" v-bind:id="di.ime" :checked="sadrziDisk(di.ime)">
								        	<label class="custom-control-label" v-bind:for="di.ime">{{ di.ime }}</label>
										</div>
								    </li>
								</ul>
							</div>
					  	</div>
					  	<div v-if=!uspesnaIzmena class="alert alert-danger mt-4" role="alert">
							<p class="mb-0"><b>Greška!</b> Ime je zauzeto.</p>
						</div>
					  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit" v-bind:disabled="izabranaMasina.ime == novaMasina.ime && istaJeKategorija && novaMasina.diskovi == izabranaMasina.diskovi">
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
		izaberiVM: function (vm) {
			this.izabranaMasina = JSON.parse(JSON.stringify(vm));
 			this.novaMasina = JSON.parse(JSON.stringify(vm));
 			axios
			.post('diskoviIzIsteOrg', this.izabranaMasina)
	        .then(response => (this.diskoviIzIsteOrg = response.data))
	        .catch(function (error) { console.log(error); });
			this.uspesnaIzmena = true;
			this.submitovano = false;
			if (this.izabranaMasina.kategorija.ime == this.novaMasina.kategorija.ime) {
	    		this.istaJeKategorija = true;
	    	} else {
	    		this.istaJeKategorija = false;
	    	}
		},
		izmenaVM : function () {
			this.submitovano = true;
			if (document.getElementById('forma-izmena-vm').checkValidity() === true) {
				axios
				.post('izmeniVM', [this.izabranaMasina, this.novaMasina])
				.then(response => {
					this.uspesnaIzmena = response.data;
					
					if (this.uspesnaIzmena) {
						axios
				        .get('ucitajMasine')
				        .then(response => (this.masine = response.data))
				        .catch(function (error) { console.log(error); });
						axios
				        .get('ucitajOrganizacije')
				        .then(response => (this.organizacije = response.data))
				        .catch(function (error) { console.log(error); });
						axios
				        .get('ucitajDiskove')
				        .then(response => (this.diskovi = response.data))
				        .catch(function (error) { console.log(error); });
						
						toast("Uspešno izmenjena virtuelna mašina.");
						$("#izmenaVMModal .close").click();
						this.submitovano = false;
					}
				})
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesnaIzmena = true;
			}
		},
		obrisiMasinu : function (vm) {
			var hoceDaBrise = confirm("Da li stvarno želite da uklonite ovu virtuelnu mašinu?");
			if (hoceDaBrise == true) {
				axios
				.post('obrisiMasinu', vm)
				.then(response => {
					toast("Uspešno uklonjena virtuelna mašina.");
					this.$router.go();
				})
				.catch(function (error) { console.log(error); });
			}
			this.$router.go();
		},
	    popuniVM() {
	    	this.novaMasina.brojJezgara = this.novaMasina.kategorija.brojJezgara;
	    	this.novaMasina.RAM = this.novaMasina.kategorija.RAM;
	    	this.novaMasina.GPUJezgra = this.novaMasina.kategorija.GPUJezgra;
	    	if (this.izabranaMasina.kategorija.ime == this.novaMasina.kategorija.ime) {
	    		this.istaJeKategorija = true;
	    	} else {
	    		this.istaJeKategorija = false;
	    	}
	    },
		sadrziDisk : function (ime) {
			return this.novaMasina.diskovi.includes(ime);
		},
		zadovoljavaBrJez : function (masina) {
	    	if (this.brjezFilter) {
	    		if (masina.brojJezgara >= this.brjezDonja && masina.brojJezgara <= this.brjezGornja) {
	    			return true;
	    		} else {
	    			return false;
	    		}
	    	} else {
	    		return true;
	    	}
		},
		zadovoljavaRAM : function (masina) {
	    	if (this.ramFilter) {
	    		if (masina.RAM >= this.ramDonja && masina.RAM <= this.ramGornja) {
	    			return true;
	    		} else {
	    			return false;
	    		}
	    	} else {
	    		return true;
	    	}
		},
		zadovoljavaGPU : function (masina) {
	    	if (this.gpuFilter) {
	    		if (masina.GPUJezgra >= this.gpuDonja && masina.GPUJezgra <= this.gpuGornja) {
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
	    filtriraneMasine : function () {
	    	return this.masine.filter(masina => {
	    	  return masina.ime.toLowerCase().includes(this.pretragaMasina.toLowerCase()) && this.zadovoljavaBrJez(masina) && this.zadovoljavaRAM(masina) && this.zadovoljavaGPU(masina)
	      	})
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
		.get('ucitajKategorije')
        .then(response => (this.kategorije = response.data))
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