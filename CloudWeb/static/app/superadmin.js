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
	},
	mounted () {
		axios
        .get('ulogovan')
        .then(response => (this.supAdm = response.data))
        .catch(function (error) { console.log(error); });
	}
});