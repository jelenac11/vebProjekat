Vue.component("super-admin", {
	data: function () {
	    return {
	    	supAdm : {
	    		email : "",
	    		lozinka : "",
	    		ime : "",
	    		prezime : "",
	    		organizacija : null,
	    		uloga : null
	    	},
	    	organizacije : [],
	    	korisnici : [],
	    	kategorije : [],
	    	masine : [],
	    	diskovi : [],
	    	izabranaOrganizacija : {},
	    	novaOrganizacija : {},
	    	izabraniKorisnik : {},
	    	noviKorisnik : {},
	    	izabranaKategorija : {},
	    	novaKategorija : {},
	    	izabranaMasina : {},
	    	novaMasina : {},
	    	izabraniDisk : {},
	    	noviDisk : {},
	    	submitovano : false,
	    	uspesnaIzmena : true,
	    	potvrdaLozinke : "",
	    	istaJeKategorija : true,
	    	poklapajuSeLozinke : true,
	    	brjezFilter : false,
	    	brjezDonja : 0,
	    	brjezGornja : 0,
	    	ramFilter : false,
	    	ramDonja : 0,
	    	ramGornja : 0,
	    	gpuFilter : false,
	    	gpuDonja : 0,
	    	gpuGornja : 0,
	    	korisniciOrganizacije : [],
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
			    	<a class="nav-link" data-toggle="pill" href="#pills-vm" role="tab">Virtuelne mašine</a>
				</li>
				<li class="nav-item">
			    	<a class="nav-link" data-toggle="pill" href="#pills-diskovi" role="tab">Diskovi</a>
				</li>
				<li class="nav-item">
			    	<a class="nav-link" data-toggle="pill" href="#pills-kategorije" role="tab">Kategorije</a>
				</li>
			 	<li class="nav-item">
			    	<a class="nav-link active" data-toggle="pill" href="#pills-organizacije" role="tab">Organizacije</a>
				</li>
			  	<li class="nav-item">
			    	<a class="nav-link" data-toggle="pill" href="#pills-korisnici" role="tab">Korisnici</a>
				</li>
			</ul>
	    </div>
	    
	    <div class="navbar-collapse collapse w-100 order-1 dual-collapse2">
	        <ul class="navbar-nav ml-auto">
	            <li class="nav-item dropdown">
	                <a class="navbar-brand dropdown-toggle" href="#" data-toggle="dropdown">
					    <img src="profilepic.png" width="30" height="30" class="d-inline-block align-top" alt="">
					    {{ this.supAdm.ime + " " + this.supAdm.prezime }}
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
						  		<p class="mb-0">{{ this.supAdm.email }}</p>
						  	</div>
					  	</li>
					  	<li class="list-group-item">
					  		<div class="d-flex w-20 justify-content-between">
						  		<h6>Ime:</h6>
						  		<p class="mb-0">{{ this.supAdm.ime }}</p>
						  	</div>
					  	</li>
					  	<li class="list-group-item">
					  		<div class="d-flex w-20 justify-content-between">
					  			<h6>Prezme:</h6>
					  			<p class="mb-0">{{ this.supAdm.prezime }}</p>
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
		<div class="tab-pane fade" id="pills-vm" role="tabpanel" >
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
		<div class="tab-pane fade" id="pills-diskovi" role="tabpanel" >
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
				      	<td width="10%"><button class="btn btn-danger btn-sm" v-on:click="obrisiDisk(d)">Ukloni</button></td>
			    	</tr>
			  	</tbody>
			</table>
			<router-link :to="{ path: 'dodavanjeDiska'}" class="btn btn-primary btn-block btn-lg my-2 p-2" id="dodavanjeDiska">Dodaj disk</router-link>
		</div>
		<div class="tab-pane fade" id="pills-kategorije" role="tabpanel" >
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
		<div class="tab-pane fade" id="pills-korisnici" role="tabpanel">
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
				      	<td width="10%"><button v-if="supAdm.email != k.email" class="btn btn-danger btn-sm" v-on:click="obrisiKorisnika(k)">Ukloni</button></td>
			    	</tr>
			  	</tbody>
			</table>
			<router-link :to="{ path: 'dodavanjeKorisnika'}" class="btn btn-primary btn-block btn-lg my-2 p-2" id="dodavanjeKor">Dodaj korisnika</router-link>
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
								<input type="text" v-model="noviDisk.ime" class="form-control" id="imedisk" placeholder="Ime diska" required>
								<div class="invalid-feedback" id="izmenaInvalid">Niste uneli ime.</div>
							</div>
						</div>
					  	<div class="form-row">
					    	<div class="col">
					    	 	<label for="tipd">Tip diska</label>
								<select class="custom-select mt-0" v-model="noviDisk.tip" id="tipd" required>
							    	<option value="HDD">HDD</option>
							    	<option value="SSD">SSD</option>
							  	</select>
					    		<div class="invalid-feedback" id="izmenaInvalid">Niste odabrali tip.</div>
							</div>
							<div class="col">
					    	 	<label for="kap">Kapacitet</label>
								<input type="number" v-model="noviDisk.kapacitet" min="0" class="form-control" id="kap" placeholder="Kapacitet" required>
								<div class="invalid-feedback" id="izmenaInvalid">Unesite ispravno kapacitet diska.</div>
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
								<select class="custom-select mt-0" v-model="noviDisk.organizacija" v-on:change="postaviMasine" id="orgdisk" disabled required>
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
		izaberiKor: function (k) {
			this.izabraniKorisnik = JSON.parse(JSON.stringify(k));
			this.noviKorisnik = JSON.parse(JSON.stringify(k));
			this.uspesnaIzmena = true;
			this.submitovano = false;
		},
		izaberiKat: function (kat) {
			this.izabranaKategorija = JSON.parse(JSON.stringify(kat));
			this.novaKategorija = JSON.parse(JSON.stringify(kat));
			this.uspesnaIzmena = true;
			this.submitovano = false;
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
		izmenaKor : function () {
			this.proveriLozinke();
			this.submitovano = true;
			if (document.getElementById('forma-izmena-kor').checkValidity() === true && this.poklapajuSeLozinke) {
				axios
				.post('izmeniKor', [this.izabraniKorisnik, this.noviKorisnik])
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
						
						toast("Uspešno izmenjen korisnik.");
						$("#izmenaKorisnikaModal .close").click();
						this.submitovano = false;
					}
				})
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesnaIzmena = true;
			}
		},
		izmenaKat : function () {
			this.submitovano = true;
			if (document.getElementById('forma-izmena-kat').checkValidity() === true) {
				axios
				.post('izmeniKat', [this.izabranaKategorija, this.novaKategorija])
				.then(response => {
					this.uspesnaIzmena = response.data;
					
					if (this.uspesnaIzmena) {
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
						
						toast("Uspešno izmenjena kategorija.");
						$("#izmenaKatModal .close").click();
						this.submitovano = false;
					}
				})
				.catch(function (error) { console.log(error); });
			} else {
				this.uspesnaIzmena = true;
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
		izmenaDisk : function () {
			this.submitovano = true;
			if (document.getElementById('forma-izmena-disk').checkValidity() === true) {
				axios
				.post('izmeniDisk', [this.izabraniDisk, this.noviDisk])
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
						
						toast("Uspešno izmenjen disk.");
						$("#izmenaDiskModal .close").click();
						this.submitovano = false;
					}
				})
				.catch(function (error) { console.log(error); });
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
		proveriLozinke : function () {
			if (this.noviKorisnik.lozinka != this.potvrdaLozinke) {
				this.poklapajuSeLozinke = false;
			} else {
				this.poklapajuSeLozinke = true;
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
	    postaviMasine : function () {
			axios
	        .post('masineIzIsteOrg', this.noviDisk)
	        .then(response => (this.masineIzIsteOrg = response.data))
	        .catch(function (error) { console.log(error); });
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
        .then(response => (this.supAdm = response.data))
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