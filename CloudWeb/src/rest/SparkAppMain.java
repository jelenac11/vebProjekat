package rest;

import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

import beans.model.Aktivnost;
import beans.model.Disk;
import beans.model.KategorijaVM;
import beans.model.Korisnik;
import beans.model.Organizacija;
import beans.model.Uloga;
import beans.model.Racun;
import beans.model.TipDiska;
import beans.model.VM;
import spark.Session;

public class SparkAppMain {

	private static Gson g = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm").create();
	
	private static ArrayList<Korisnik> korisnici = new ArrayList<Korisnik>();
	private static ArrayList<Organizacija> organizacije = new ArrayList<Organizacija>();
	private static ArrayList<KategorijaVM> kategorije = new ArrayList<KategorijaVM>();
	private static ArrayList<VM> masine = new ArrayList<VM>();
	private static ArrayList<Disk> diskovi = new ArrayList<Disk>();

	public static void main(String[] args) throws Exception {
		port(8080);

		String sep = System.getProperty("file.separator");

		staticFiles.externalLocation(new File("." + sep + "static").getCanonicalPath());
		
//		korisnici.add(new Korisnik("super@admin", "sa", "Super", "Admin", "nema", Uloga.SUPER_ADMIN));
		ucitajFajlove();

		post("/login", (req, res) -> {
			res.type("application/json");
			Korisnik ulog = g.fromJson(req.body(), Korisnik.class);
			for (Korisnik k : korisnici) {
				if (k.getEmail().equals(ulog.getEmail()) && k.getLozinka().equals(ulog.getLozinka())) {
					Session ss = req.session(true);
					Korisnik korisnik = ss.attribute("korisnik");
					if (korisnik == null) {
						korisnik = k;
						ss.attribute("korisnik", korisnik);
					} else {
						res.status(403);
						return g.toJson(false);
					}
					res.status(200);
					return g.toJson(true);
				}
			}
			res.status(200);
			return g.toJson(false);
		});

		get("/ulogovan", (req, res) -> {
			res.type("application/json");
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			} else {
				res.status(200);
				return g.toJson(korisnik);
			}
		});
		
		get("/testLogin", (req, res) -> {
			res.type("application/json");
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(200);
				return g.toJson(false);
			} else {
				res.status(200);
				return g.toJson(true);
			}
		});

		post("/izmeniProfil", (req, res) -> {
			res.type("application/json");
			
			Korisnik stari = req.session().attribute("korisnik");
			Korisnik izmenjen = g.fromJson(req.body(), Korisnik.class);

			if (stari == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			for (Korisnik k : korisnici) {
				if (!k.getEmail().equals(stari.getEmail())) {
					if (k.getEmail().equals(izmenjen.getEmail())) {
						res.status(400);
						return g.toJson(false);
					}
				}
			}

			for (int i = 0; i < korisnici.size(); i++) {
				if (korisnici.get(i).getEmail().equals(stari.getEmail())) {
					req.session().attribute("korisnik", izmenjen);
					korisnici.set(i, izmenjen);
					
					for (Organizacija org : organizacije) {
						if (org.getIme().equals(izmenjen.getOrganizacija())) {
							for (int j = 0; j < org.getKorisnici().size(); j++) {
								if (org.getKorisnici().get(j).equals(stari.getEmail())) {
									org.getKorisnici().set(j, izmenjen.getEmail());
								}
							}
						}
					}
					
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(true);
		});

		post("/izmeniOrg", (req, res) -> {
			res.type("application/json");
			Organizacija[] parametri = g.fromJson(req.body(), Organizacija[].class);
			Organizacija stara = parametri[0];
			Organizacija izmenjena = parametri[1];

			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(izmenjena.getIme())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (Organizacija o : organizacije) {
				if (!o.getIme().equals(stara.getIme())) {
					if (o.getIme().equals(izmenjena.getIme())) {
						res.status(400);
						return g.toJson(false);
					}
				}
			}

			for (int i = 0; i < organizacije.size(); i++) {
				if (organizacije.get(i).getIme().equals(stara.getIme())) {
					organizacije.set(i, izmenjena);
					for (String email : izmenjena.getKorisnici()) {
						for (Korisnik k : korisnici) {
							if (k.getEmail().equals(email)) {
								k.setOrganizacija(izmenjena.getIme());
							}
						}
					}
					
					for (VM virtm : masine) {
						if (virtm.getOrganizacija().equals(stara.getIme())) {
							virtm.setOrganizacija(izmenjena.getIme());
						}
					}
					
					for (Disk disk : diskovi) {
						if (disk.getOrganizacija().equals(stara.getIme())) {
							disk.setOrganizacija(izmenjena.getIme());
						}
					}
					
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(true);
		});

		post("/izmeniKor", (req, res) -> {
			res.type("application/json");
			Korisnik[] parametri = g.fromJson(req.body(), Korisnik[].class);
			Korisnik stari = parametri[0];
			Korisnik izmenjeni = parametri[1];
		
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(izmenjeni.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (int i = 0; i < korisnici.size(); i++) {
				if (korisnici.get(i).getEmail().equals(stari.getEmail())) {
					korisnici.set(i, izmenjeni);
					
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(true);
		});
		
		post("/izmeniKat", (req, res) -> {
			res.type("application/json");
			KategorijaVM[] parametri = g.fromJson(req.body(), KategorijaVM[].class);
			KategorijaVM stara = parametri[0];
			KategorijaVM izmenjena = parametri[1];
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			for (KategorijaVM ka : kategorije) {
				if (!ka.getIme().equals(stara.getIme())) {
					if (ka.getIme().equals(izmenjena.getIme())) {
						res.status(400);
						return g.toJson(false);
					}
				}
			}
			for (VM mas : masine) {
				if (!mas.getIme().equals(stara.getIme())) {
					if (mas.getIme().equals(izmenjena.getIme())) {
						res.status(400);
						return g.toJson(false);
					}
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(izmenjena.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			
			for (int i = 0; i < kategorije.size(); i++) {
				if (kategorije.get(i).getIme().equals(stara.getIme())) {
					
					kategorije.set(i, izmenjena);

					for (VM masina : masine) {
						if (masina.getKategorija().getIme().equals(stara.getIme())) {
							masina.setKategorija(izmenjena);
						}
					}
					
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(true);
		});
		
		post("/izmeniVM", (req, res) -> {
			res.type("application/json");
			VM[] parametri = g.fromJson(req.body(), VM[].class);
			VM stara = parametri[0];
			VM izmenjena = parametri[1];
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(izmenjena.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (KategorijaVM ka : kategorije) {
				if (!ka.getIme().equals(stara.getIme())) {
					if (ka.getIme().equals(izmenjena.getIme())) {
						res.status(400);
						return g.toJson(false);
					}
				}
			}
			for (VM mas : masine) {
				if (!mas.getIme().equals(stara.getIme())) {
					if (mas.getIme().equals(izmenjena.getIme())) {
						res.status(400);
						return g.toJson(false);
					}
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(izmenjena.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			
			for (int i = 0; i < masine.size(); i++) {
				if (masine.get(i).getIme().equals(stara.getIme())) {
					masine.set(i, izmenjena);
					
					for (Organizacija org : organizacije) {
						for (int j = 0; j < org.getResursi().size(); j++) {
							if (org.getResursi().get(j).equals(stara.getIme())) {
								org.getResursi().set(j, izmenjena.getIme());
							}
						}
					}
					
					for (String dstr : stara.getDiskovi()) {
						for (Disk d : diskovi) {
							if (d.getIme().equals(dstr)) {
								d.setVirtuelnaMasina("");
							}
						}
					}
					
					for (String dstr : izmenjena.getDiskovi()) {
						for (Disk d : diskovi) {
							if (d.getIme().equals(dstr)) {
								d.setVirtuelnaMasina(izmenjena.getIme());
							}
						}
					}
					
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(true);
		});
		
		post("/izmeniDisk", (req, res) -> {
			res.type("application/json");
			Disk[] parametri = g.fromJson(req.body(), Disk[].class);
			Disk stari = parametri[0];
			Disk izmenjeni = parametri[1];

			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(stari.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (KategorijaVM ka : kategorije) {
				if (!ka.getIme().equals(stari.getIme())) {
					if (ka.getIme().equals(izmenjeni.getIme())) {
						res.status(400);
						return g.toJson(false);
					}
				}
			}
			for (VM mas : masine) {
				if (!mas.getIme().equals(stari.getIme())) {
					if (mas.getIme().equals(izmenjeni.getIme())) {
						res.status(400);
						return g.toJson(false);
					}
				}
			}
			for (Disk dis : diskovi) {
				if (!dis.getIme().equals(stari.getIme())) {
					if (dis.getIme().equals(izmenjeni.getIme())) {
						res.status(400);
						return g.toJson(false);
					}
				}
			}

			for (int i = 0; i < diskovi.size(); i++) {
				if (diskovi.get(i).getIme().equals(stari.getIme())) {
					diskovi.set(i, izmenjeni);
					
					for (Organizacija org : organizacije) {
						for (int j = 0; j < org.getResursi().size(); j++) {
							if (org.getResursi().get(j).equals(stari.getIme())) {
								org.getResursi().set(j, izmenjeni.getIme());
							}
						}
					}
					
					for (VM vm : masine) {
						if (vm.getIme().equals(stari.getVirtuelnaMasina())) {
							vm.getDiskovi().remove(stari.getIme());
						}
					}
					
					for (VM vm : masine) {
						if (vm.getIme().equals(izmenjeni.getVirtuelnaMasina())) {
							vm.getDiskovi().add(izmenjeni.getIme());
						}
					}
					
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(true);
		});
		
		post("/obrisiKorisnika", (req, res) -> {
			res.type("application/json");
			Korisnik zaBrisanje = g.fromJson(req.body(), Korisnik.class);

			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(zaBrisanje.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (int i = 0; i < korisnici.size(); i++) {
				if (korisnici.get(i).getEmail().equals(zaBrisanje.getEmail())) {
					korisnici.remove(i);
					
					for (Organizacija org : organizacije) {
						if (org.getIme().equals(zaBrisanje.getOrganizacija())) {
							org.getKorisnici().remove(zaBrisanje.getEmail());
						}
					}
					upisiUFajl();
					break;
				}
			}
			
			res.status(200);
			return g.toJson(true);
		});
		
		post("/obrisiKategoriju", (req, res) -> {
			res.type("application/json");
			KategorijaVM zaBrisanje = g.fromJson(req.body(), KategorijaVM.class);
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			for (int i = 0; i < kategorije.size(); i++) {
				if (kategorije.get(i).getIme().equals(zaBrisanje.getIme())) {
					
					for (VM masina : masine) {
						if (masina.getKategorija().getIme().equals(zaBrisanje.getIme())) {
							res.status(400);
							return g.toJson(false);
						}
					}
					kategorije.remove(i);
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(true);
		});
		
		post("/obrisiMasinu", (req, res) -> {
			res.type("application/json");
			VM zaBrisanje = g.fromJson(req.body(), VM.class);
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(zaBrisanje.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (int i = 0; i < masine.size(); i++) {
				if (masine.get(i).getIme().equals(zaBrisanje.getIme())) {
					masine.remove(i);

					for (Organizacija org : organizacije) {
						if (org.getIme().equals(zaBrisanje.getOrganizacija())) {
							org.getResursi().remove(zaBrisanje.getIme());
						}
					}
					
					for (Disk dis : diskovi) {
						if (dis.getVirtuelnaMasina().equals(zaBrisanje.getIme())) {
							dis.setVirtuelnaMasina("");
						}
					}
					
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(true);
		});
		
		post("/obrisiDisk", (req, res) -> {
			res.type("application/json");
			Disk zaBrisanje = g.fromJson(req.body(), Disk.class);

			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(zaBrisanje.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (int i = 0; i < diskovi.size(); i++) {
				if (diskovi.get(i).getIme().equals(zaBrisanje.getIme())) {
					diskovi.remove(i);

					for (Organizacija org : organizacije) {
						if (org.getIme().equals(zaBrisanje.getOrganizacija())) {
							org.getResursi().remove(zaBrisanje.getIme());
						}
					}

					for (VM vm : masine) {
						if (vm.getIme().equals(zaBrisanje.getVirtuelnaMasina())) {
							vm.getDiskovi().remove(zaBrisanje.getIme());
						}
					}
					
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(true);
		});

		post("/dodajOrg", (req, res) -> {
			res.type("application/json");
			Organizacija nova = g.fromJson(req.body(), Organizacija.class);
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			for (Organizacija o : organizacije) {
				if (o.getIme().equals(nova.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}

			organizacije.add(nova);
			upisiUFajl();
			res.status(200);
			return g.toJson(true);
		});
		
		post("/dodajKor", (req, res) -> {
			res.type("application/json");
			Korisnik novi = g.fromJson(req.body(), Korisnik.class);

			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(novi.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (Korisnik k : korisnici) {
				if (k.getEmail().equals(novi.getEmail())) {
					res.status(400);
					return g.toJson(false);
				}
			}

			for (Organizacija o : organizacije) {
				if (o.getIme().equals(novi.getOrganizacija())) {
					o.getKorisnici().add(novi.getEmail());
					break;
				}
			}

			korisnici.add(novi);
			upisiUFajl();
			res.status(200);
			return g.toJson(true);
		});
		
		post("/dodajKat", (req, res) -> {
			res.type("application/json");
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			KategorijaVM nova = g.fromJson(req.body(), KategorijaVM.class);
			
			for (KategorijaVM k : kategorije) {
				if (k.getIme().equals(nova.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			for (VM mas : masine) {
				if (mas.getIme().equals(nova.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(nova.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			
			kategorije.add(nova);
			upisiUFajl();
			res.status(200);
			return g.toJson(true);
		});
		
		post("/dodajVM", (req, res) -> {
			res.type("application/json");
			VM nova = g.fromJson(req.body(), VM.class);
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(nova.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (KategorijaVM k : kategorije) {
				if (k.getIme().equals(nova.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			for (VM mas : masine) {
				if (mas.getIme().equals(nova.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(nova.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			
			for (Organizacija organ : organizacije) {
				if (organ.getIme().equals(nova.getOrganizacija())) {
					organ.getResursi().add(nova.getIme());
				}
			}
			
			masine.add(nova);
			upisiUFajl();
			res.status(200);
			return g.toJson(true);
		});
		
		post("/dodajDisk", (req, res) -> {
			res.type("application/json");
			Disk novi = g.fromJson(req.body(), Disk.class);
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(novi.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			for (KategorijaVM k : kategorije) {
				if (k.getIme().equals(novi.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			for (VM mas : masine) {
				if (mas.getIme().equals(novi.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(novi.getIme())) {
					res.status(400);
					return g.toJson(false);
				}
			}
			
			for (VM vm : masine) {
				if (vm.getIme().equals(novi.getVirtuelnaMasina())) {
					vm.getDiskovi().add(novi.getIme());
				}
			}
			
			for (Organizacija organ : organizacije) {
				if (organ.getIme().equals(novi.getOrganizacija())) {
					organ.getResursi().add(novi.getIme());
				}
			}
			
			diskovi.add(novi);
			upisiUFajl();
			res.status(200);
			return g.toJson(true);
		});

		post("/korisniciOrganizacije", (req, res) -> {
			res.type("application/json");
			Organizacija org = g.fromJson(req.body(), Organizacija.class);
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (korisnik.getUloga().equals(Uloga.KORISNIK)) {
					res.status(403);
					return g.toJson("Forbidden");
				} else {
					if (!korisnik.getOrganizacija().equals(org.getIme())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			ArrayList<Korisnik> korisniciOrganizacije = new ArrayList<Korisnik>();
			if (org.getKorisnici() != null) {
				for (String email : org.getKorisnici()) {
					for (Korisnik kor : korisnici) {
						if (kor.getEmail().equals(email)) {
							korisniciOrganizacije.add(kor);
						}
					}
				}
			}
			res.status(200);
			return g.toJson(korisniciOrganizacije);
		});
		
		post("/masineIzIsteOrg", (req, res) -> {
			res.type("application/json");
			
			Disk disk = g.fromJson(req.body(), Disk.class);
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (disk.getOrganizacija() != null) {
					if (!korisnik.getOrganizacija().equals(disk.getOrganizacija())) {
						res.status(403);
						return g.toJson("Forbidden");
					}
				}
			}
			
			ArrayList<VM> masineIzIsteOrg = new ArrayList<VM>();
			for (VM virtm : masine) {
				if (virtm.getOrganizacija().equals(disk.getOrganizacija())) {
					masineIzIsteOrg.add(virtm);
				}
			}
			res.status(200);
			return g.toJson(masineIzIsteOrg);
		});
		
		post("/diskoviIzIsteOrg", (req, res) -> {
			res.type("application/json");
			VM virm = g.fromJson(req.body(), VM.class);
			
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (!korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				if (!korisnik.getOrganizacija().equals(virm.getOrganizacija())) {
					res.status(403);
					return g.toJson("Forbidden");
				}
			}
			
			ArrayList<Disk> diskoviIzIsteOrg = new ArrayList<Disk>();
			for (Disk dis : diskovi) {
				if (dis.getOrganizacija().equals(virm.getOrganizacija())) {
					if (dis.getVirtuelnaMasina().equals("") || dis.getVirtuelnaMasina().equals(virm.getIme())) {
						diskoviIzIsteOrg.add(dis);
					}
				}
			}
			res.status(200);
			return g.toJson(diskoviIzIsteOrg);
		});

		get("/ucitajOrganizacije", (req, res) -> {
			res.type("application/json");
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (korisnik.getUloga() == Uloga.KORISNIK) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			ArrayList<Organizacija> organi = new ArrayList<Organizacija>();
			if (korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				organi = organizacije;
			} else {
				for (Organizacija org : organizacije) {
					if (org.getIme().equals(korisnik.getOrganizacija())) {
						organi.add(org);
					}
				}
			}
			
			res.status(200);
			return g.toJson(organi);
		});
		
		get("/ucitajKorisnike", (req, res) -> {
			res.type("application/json");
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (korisnik.getUloga() == Uloga.KORISNIK) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			ArrayList<Korisnik> korisni = new ArrayList<Korisnik>();
			if (korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				korisni = korisnici;
			} else {
				for (Organizacija org : organizacije) {
					if (org.getIme().equals(korisnik.getOrganizacija())) {
						for (String kStr : org.getKorisnici()) {
							for (Korisnik k : korisnici) {
								if (k.getEmail().equals(kStr)) {
									korisni.add(k);
									break;
								}
							}
						}
						break;
					}
				}
			}
			
			res.status(200);
			return g.toJson(korisni);
		});
		
		get("/ucitajKategorije", (req, res) -> {
			res.type("application/json");
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			res.status(200);
			return g.toJson(kategorije);
		});
		
		get("/ucitajMasine", (req, res) -> {
			res.type("application/json");
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			ArrayList<VM> masinice = new ArrayList<VM>();
			
			if (korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				masinice = masine;
			} else {
				for (Organizacija org : organizacije) {
					if (org.getIme().equals(korisnik.getOrganizacija())) {
						for (String mStr : org.getResursi()) {
							for (VM m : masine) {
								if (m.getIme().equals(mStr)) {
									masinice.add(m);
									break;
								}
							}
						}
						break;
					}
				}
			}
			
			res.status(200);
			return g.toJson(masinice);
		});
		
		get("/ucitajDiskove", (req, res) -> {
			res.type("application/json");
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			ArrayList<Disk> diskici = new ArrayList<Disk>();
			
			if (korisnik.getUloga().equals(Uloga.SUPER_ADMIN)) {
				diskici = diskovi;
			} else {
				for (Organizacija org : organizacije) {
					if (org.getIme().equals(korisnik.getOrganizacija())) {
						for (String dStr : org.getResursi()) {
							for (Disk d : diskovi) {
								if (d.getIme().equals(dStr)) {
									diskici.add(d);
									break;
								}
							}
						}
						break;
					}
				}
			}
			
			res.status(200);
			return g.toJson(diskici);
		});
		
		post("/ukljuciiskljuciVM", (req, res) -> {
			res.type("application/json");
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			if (korisnik.getUloga() != Uloga.ADMIN && korisnik.getUloga() != Uloga.SUPER_ADMIN) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			VM mas = g.fromJson(req.body(), VM.class);
			
			VM retVal = null;
			for (int i = 0; i < masine.size(); i++) {
				if (masine.get(i).getIme().equals(mas.getIme())) {
					masine.get(i).setStatus(!masine.get(i).isStatus());
					
					if (masine.get(i).isStatus()) {
						masine.get(i).getListaAktivnosti().add(new Aktivnost(new Date(), null));
					} else {
						masine.get(i).getListaAktivnosti().get(masine.get(i).getListaAktivnosti().size() - 1).setUgasena(new Date());
					}
					retVal = masine.get(i);
					upisiUFajl();
					break;
				}
			}
			res.status(200);
			return g.toJson(retVal);
		});

		get("/logout", (req, res) -> {
			res.type("application/json");
			
			Korisnik korisnik = req.session().attribute("korisnik");
			if (korisnik != null) {
				req.session().invalidate();
				res.status(200);
				return g.toJson(true);
			} else {
				res.status(400);
				return g.toJson(false);
			}
		});
		
		post("/izracunaj", (req, res) -> {
			res.type("application/json");
			
			Korisnik korisnik = req.session().attribute("korisnik");
			
			if (korisnik == null) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			if (korisnik.getUloga() != Uloga.ADMIN) {
				res.status(403);
				return g.toJson("Forbidden");
			}
			
			double jezgro = 25;
			double ram = 15;
			double cuda = 1;
			double hdd = 0.1;
			double ssd = 0.3;

			JsonParser jp = new JsonParser();
			JsonObject jsonParam = jp.parse(req.body()).getAsJsonObject();
			String pocetakStr = jsonParam.get("pocetak").getAsString();
			String krajStr = jsonParam.get("kraj").getAsString();
			
			pocetakStr = pocetakStr.replace("T", " ");
			krajStr = krajStr.replace("T", " ");
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			Date pocetak = sdf.parse(pocetakStr);
			Date kraj = sdf.parse(krajStr);

			if (kraj.before(pocetak)) {
				res.status(400);
				return g.toJson("Greska");
			}
			
			Organizacija org = null;
			for (Organizacija o : organizacije) {
				if (korisnik.getOrganizacija().equals(o.getIme())) {
					org = o;
					break;
				}
			}
			
			ArrayList<Racun> racuni = new ArrayList<Racun>();
			
			for (String resursStr : org.getResursi()) {
				for (VM vmObj : masine) {
					if (resursStr.equals(vmObj.getIme())) {
						double cena = 0;
						
						for (Aktivnost ak : vmObj.getListaAktivnosti()) {
							String upaljenaStr = sdf.format(ak.getUpaljena());
							upaljenaStr = upaljenaStr.replace("T", " ");
							Date upaljena = sdf.parse(upaljenaStr);
							
							String ugasenaStr = "";
							Date ugasena = null;
							if (ak.getUgasena() != null) {
								ugasenaStr = sdf.format(ak.getUgasena());
								ugasenaStr = ugasenaStr.replace("T", " ");
								ugasena = sdf.parse(ugasenaStr);
							} else {
								ugasena = kraj;
							}
							
							Date pocetakRacunanjaRada = null;
							Date krajRacunanjaRada = null;
							
							if(upaljena.compareTo(pocetak) <= 0 && ugasena.compareTo(kraj) <= 0) {
								pocetakRacunanjaRada = pocetak;
								krajRacunanjaRada = ugasena;
							} else if (pocetak.compareTo(upaljena) <= 0 && kraj.compareTo(ugasena) <= 0) {
								pocetakRacunanjaRada = upaljena;
								krajRacunanjaRada = kraj;
							} else if (upaljena.compareTo(pocetak) <= 0 && kraj.compareTo(ugasena) <= 0) {
								pocetakRacunanjaRada = pocetak;
								krajRacunanjaRada = kraj;
							} else if (pocetak.compareTo(upaljena) <= 0 && ugasena.compareTo(kraj) <= 0) {
								pocetakRacunanjaRada = upaljena;
								krajRacunanjaRada = ugasena;
							} else {
								pocetakRacunanjaRada = new Date();
								krajRacunanjaRada = pocetakRacunanjaRada;
							}
								
							long razlika = Math.abs(pocetakRacunanjaRada.getTime() - krajRacunanjaRada.getTime());
							long brojSati = razlika/(60*60*1000);
							cena += brojSati*(vmObj.getBrojJezgara()*jezgro/30/24) + brojSati*(vmObj.getRAM()*ram/30/24);
							if (vmObj.getGPUJezgra() != 0) {
								cena += brojSati*(vmObj.getGPUJezgra()*cuda/30/24);
							}
						}
						
						racuni.add(new Racun(vmObj.getIme(), cena));
					}
				}
				
				for (Disk diskObj : diskovi) {
					if (resursStr.equals(diskObj.getIme())) {
						double cena = 0;
						
						long razlika = Math.abs(pocetak.getTime() - kraj.getTime());
						long brojSati = razlika/(60*60*1000);

						double cenaZaKapacitet = 0;
						if (diskObj.getTip() == TipDiska.HDD) {
							cenaZaKapacitet = hdd;
						} else {
							cenaZaKapacitet = ssd;
						}
						
						cena += brojSati*(diskObj.getKapacitet()*cenaZaKapacitet/30/24);
						racuni.add(new Racun(diskObj.getIme(), cena));
					}
				}
			}
			
			res.status(200);
			return g.toJson(racuni);
		});
	}

	private static void ucitajFajlove() throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		String sep = System.getProperty("file.separator");
		
		Korisnik[] korisniciLista = g.fromJson(new FileReader("resursi" + sep + "korisnici.json"), Korisnik[].class);
		korisnici = new ArrayList<Korisnik>(Arrays.asList(korisniciLista));
		Organizacija[] organizacijeLista = g.fromJson(new FileReader("resursi" + sep + "organizacije.json"), Organizacija[].class);
		organizacije = new ArrayList<Organizacija>(Arrays.asList(organizacijeLista));
		KategorijaVM[] kategorijeLista = g.fromJson(new FileReader("resursi" + sep + "kategorije.json"), KategorijaVM[].class);
		kategorije = new ArrayList<KategorijaVM>(Arrays.asList(kategorijeLista));
		VM[] masineLista = g.fromJson(new FileReader("resursi" + sep + "masine.json"), VM[].class);
		masine = new ArrayList<VM>(Arrays.asList(masineLista));
		Disk[] diskoviLista = g.fromJson(new FileReader("resursi" + sep + "diskovi.json"), Disk[].class);
		diskovi = new ArrayList<Disk>(Arrays.asList(diskoviLista));
	}

	private static void upisiUFajl() throws IOException {
		String sep = System.getProperty("file.separator");

		PrintWriter writerKorisnici = new PrintWriter(
				new FileWriter(new File("." + sep + "resursi" + sep + "korisnici.json")));
		writerKorisnici.write(g.toJson(korisnici));
		writerKorisnici.close();

		PrintWriter writerOrganizacije = new PrintWriter(
				new FileWriter(new File("." + sep + "resursi" + sep + "organizacije.json")));
		writerOrganizacije.write(g.toJson(organizacije));
		writerOrganizacije.close();
		
		PrintWriter writerKategorije = new PrintWriter(
				new FileWriter(new File("." + sep + "resursi" + sep + "kategorije.json")));
		writerKategorije.write(g.toJson(kategorije));
		writerKategorije.close();
		
		PrintWriter writerMasine = new PrintWriter(
				new FileWriter(new File("." + sep + "resursi" + sep + "masine.json")));
		writerMasine.write(g.toJson(masine));
		writerMasine.close();
		
		PrintWriter writerDiskovi = new PrintWriter(
				new FileWriter(new File("." + sep + "resursi" + sep + "diskovi.json")));
		writerDiskovi.write(g.toJson(diskovi));
		writerDiskovi.close();
	}
}
