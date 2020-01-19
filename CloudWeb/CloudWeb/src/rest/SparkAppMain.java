package rest;

import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import beans.model.Disk;
import beans.model.KategorijaVM;
import beans.model.Korisnik;
import beans.model.Organizacija;
import beans.model.Uloga;
import beans.model.VM;
import spark.Request;
import spark.Session;

public class SparkAppMain {

	private static Gson g = new Gson();
	private static ArrayList<Korisnik> korisnici = new ArrayList<Korisnik>();
	private static ArrayList<Organizacija> organizacije = new ArrayList<Organizacija>();

	public static void main(String[] args) throws Exception {
		port(8080);

		String sep = System.getProperty("file.separator");

		staticFiles.externalLocation(new File("." + sep + "static").getCanonicalPath());

		korisnici.add(new Korisnik("super@admin", "sa", "Super", "Admin", "nema", Uloga.SUPER_ADMIN));
		//ucitajFajlove();

		post("/login", (req, res) -> {
			Korisnik ulog = g.fromJson(req.body(), Korisnik.class);
			for (Korisnik k : korisnici) {
				if (k.getEmail().equals(ulog.getEmail()) && k.getLozinka().equals(ulog.getLozinka())) {
					Session ss = req.session(true);
					Korisnik korisnik = ss.attribute("korisnik");
					if (korisnik == null) {
						korisnik = k;
						ss.attribute("korisnik", korisnik);
					}
					return true;
				}
			}
			return false;
		});
		
		get("/ulogovan", (req, res) -> {
			res.type("application/json");
			Session ss = req.session(true);
			Korisnik korisnik = ss.attribute("korisnik");
			if (korisnik == null) {
				return new Korisnik();
			} else {
				return g.toJson(korisnik);
			}
		});

		post("/izmeniProfil", (req, res) -> {
			Session ss = req.session(true);
			Korisnik stari = ss.attribute("korisnik");
			Korisnik izmenjen = g.fromJson(req.body(), Korisnik.class);

			for (Korisnik k : korisnici) {
				if (!k.getEmail().equals(stari.getEmail())) {
					if (k.getEmail().equals(izmenjen.getEmail())) {
						return false;
					}
				}
			}

			for (int i = 0; i < korisnici.size(); i++) {
				if (korisnici.get(i).getEmail().equals(stari.getEmail())) {
					ss.attribute("korisnik", izmenjen);
					korisnici.set(i, izmenjen);
					
					for (Organizacija org : organizacije) {
						if (org.getIme().equals(izmenjen.getOrganizacija())) {
							for (int j = 0; j < org.getKorisnici().size(); j++) {
								if (org.getKorisnici().get(j).equals(stari.getIme())) {
									org.getKorisnici().set(j, izmenjen.getIme());
								}
							}
						}
					}
					
					upisiUFajl();
					break;
				}
			}
			return true;
		});
		
		post("/izmeniOrg", (req, res) -> {
			Organizacija[] parametri = g.fromJson(req.body(), Organizacija[].class);
			Organizacija stara = parametri[0];
			Organizacija izmenjena = parametri[1];

			for (Organizacija o : organizacije) {
				if (!o.getIme().equals(stara.getIme())) {
					if (o.getIme().equals(izmenjena.getIme())) {
						return false;
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
					
					upisiUFajl();
					break;
				}
			}
			return true;
		});
		
		post("/izmeniKor", (req, res) -> {
			Korisnik[] parametri = g.fromJson(req.body(), Korisnik[].class);
			Korisnik stari = parametri[0];
			Korisnik izmenjeni = parametri[1];
			
			for (int i = 0; i < korisnici.size(); i++) {
				if (korisnici.get(i).getEmail().equals(stari.getEmail())) {
					korisnici.set(i, izmenjeni);
					
					upisiUFajl();
					break;
				}
			}
			return true;
		});
		
		post("/dodajOrg", (req, res) -> {
			Organizacija nova = g.fromJson(req.body(), Organizacija.class);
			
			for (Organizacija o : organizacije) {
				if (o.getIme().equals(nova.getIme())) {
					return false;
				}
			}

			organizacije.add(nova);
			upisiUFajl();
			return true;
		});
		
		post("/dodajKor", (req, res) -> {
			Korisnik novi = g.fromJson(req.body(), Korisnik.class);
			
			for (Korisnik k : korisnici) {
				if (k.getEmail().equals(novi.getEmail())) {
					return false;
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
			return true;
		});
		
		post("/obrisiKorisnika", (req, res) -> {
			Korisnik zaBrisanje = g.fromJson(req.body(), Korisnik.class);
			
			for (int i = 0; i < korisnici.size(); i++) {
				if (korisnici.get(i).getEmail().equals(zaBrisanje.getEmail())) {
					korisnici.remove(i);
					
					for (Organizacija org : organizacije) {
						if (org.getIme().equals(zaBrisanje.getOrganizacija())) {
							org.getKorisnici().remove(zaBrisanje.getIme());
						}
					}
					upisiUFajl();
					break;
				}
			}
			return true;
		});
		
		get("/ucitajOrganizacije", (req, res) -> {
			res.type("application/json");
			return g.toJson(organizacije);
		});
		
		get("/ucitajKorisnike", (req, res) -> {
			res.type("application/json");
			return g.toJson(korisnici);
		});
		
		get("/logout", (req, res) -> {
			Session ss = req.session(true);
			Korisnik korisnik = ss.attribute("korisnik");
			if (korisnik != null) {
				ss.invalidate();
			}
			return true;
		});
	}
	
	private static void ucitajFajlove() throws JsonSyntaxException, JsonIOException, FileNotFoundException {
		String sep = System.getProperty("file.separator");
		
		Korisnik[] korisniciLista = g.fromJson(new FileReader("resursi" + sep + "korisnici.json"), Korisnik[].class);
		korisnici = new ArrayList<Korisnik>(Arrays.asList(korisniciLista));
		Organizacija[] organizacijeLista = g.fromJson(new FileReader("resursi" + sep + "organizacije.json"), Organizacija[].class);
		organizacije = new ArrayList<Organizacija>(Arrays.asList(organizacijeLista));
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
	}
}
