Vue.component("racuni", {
	data: function () {
	    return {
	    	korisnik : {
	    		email : "",
	    		lozinka : "",
	    		ime : "",
	    		prezime : "",
	    		organizacija : null,
	    		uloga : null
	    	},
	    	racuni : [],
	    	submitovano : false,
	    	ispravno : true,
	    	regularniDatumiAkt : true,
	    	prikazi : false,
	    	pocetak : null,
	    	kraj : null,
	    }
	},
	template: `
<div class="container d-flex justify-content-center">
	<div class="card mt-5" style="width: 47rem;">
		<h4 class="card-header">Izaberi period</h4>
		<div class="card-body">
			<form class="needs-validation mb-4" v-bind:class="{ 'was-validated': submitovano }" novalidate @submit.prevent="izracunaj" id="forma-racun">
			  	<div class="form-row mb-3">
			    	<div class="col">
			    		<label for="pocet" class="mt-1">Početni datum</label>
						<input class="form-control" type="datetime-local" v-model="pocetak" id="pocet" required>
						<div class="invalid-feedback mt-2">Niste uneli datum.</div>
					</div>
			    	<div class="col">
			    		<label for="kr" class="mt-1">Krajnji datum</label>
						<input class="form-control" type="datetime-local" v-model="kraj" id="kr" required>
						<div class="invalid-feedback mt-1">Niste uneli datum.</div>
			    	</div>
			  	</div>
			  	<div v-if=!ispravno class="alert alert-danger mt-4" role="alert">
					<p class="mb-0"><b>Greška!</b> Početni datum mora biti pre kranjeg.</p>
				</div>
				<div v-if=!regularniDatumiAkt class="alert alert-danger mt-4" role="alert">
					<p class="mb-0"><b>Greška!</b> Datumi ne smeju biti u budućnosti.</p>
				</div>
			  	<button class="btn btn-lg btn-primary btn-block mt-4" type="submit">Izračunaj</button>
			</form>
			<router-link :to="{ path: 'organizacije' }" class="btn btn-secondary">Nazad</router-link>
		</div>
	</div>
	
	<div class="card mt-5 ml-4" v-if=prikazi style="width: 47rem;">
		<h4 class="card-header">Račun</h4>
		<div class="card-body">
    		<table class="table table-hover" id="tabelaRacuna">
			  	<thead>
			    	<tr>
			      		<th scope="col" width="70%">Ime resursa</th>
			      		<th scope="col" width="30%">cena</th>
			    	</tr>
			  	</thead>
			  	<tbody>
			    	<tr v-for="r in racuni">
				        <td width="70%">{{ r.resurs }}</td>
				        <td width="30%">{{ Number((r.cena).toFixed(2)) }}</td>
					</tr>
			  	</tbody>
			</table>
		</div>
	</div>
</div>	
`
	,
	methods : {
		izracunaj : function () {
			this.regularniDatumiAkt = true;
			var trenutno = new Date();
			
			var pocet = new Date(this.pocetak);
			var kr = new Date(this.kraj);
			
			if (pocet.getTime() > trenutno.getTime() || kr.getTime() > trenutno.getTime()) {
				this.regularniDatumiAkt = false;
				return;
			}
			
			this.submitovano = true;
			if (document.getElementById('forma-racun').checkValidity() === true) {
				axios
		        .post('izracunaj', { "pocetak": this.pocetak, "kraj": this.kraj })
		        .then(response => {
		        	this.racuni = response.data;
		        	this.ispravno = true;
		        	this.prikazi = true;
		        })
		        .catch(error => {
		        	console.log(error);
		        	this.ispravno = false;
		        	this.prikazi = false;
				});
			} else {
				this.ispravno = true;
				this.prikazi = false;
			}
		}
	}
});