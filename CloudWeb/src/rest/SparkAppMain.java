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
import java.util.ArrayList;
import java.util.Arrays;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import beans.model.Disk;
import beans.model.KategorijaVM;
import beans.model.Korisnik;
import beans.model.Organizacija;
import beans.model.VM;
import spark.Session;

public class SparkAppMain {

	private static Gson g = new Gson();
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
		
		post("/izmeniKat", (req, res) -> {
			KategorijaVM[] parametri = g.fromJson(req.body(), KategorijaVM[].class);
			KategorijaVM stara = parametri[0];
			KategorijaVM izmenjena = parametri[1];
			
			for (KategorijaVM ka : kategorije) {
				if (!ka.getIme().equals(stara.getIme())) {
					if (ka.getIme().equals(izmenjena.getIme())) {
						return false;
					}
				}
			}
			for (VM mas : masine) {
				if (!mas.getIme().equals(stara.getIme())) {
					if (mas.getIme().equals(izmenjena.getIme())) {
						return false;
					}
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(izmenjena.getIme())) {
					return false;
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
			return true;
		});
		
		post("/izmeniVM", (req, res) -> {
			VM[] parametri = g.fromJson(req.body(), VM[].class);
			VM stara = parametri[0];
			VM izmenjena = parametri[1];

			for (KategorijaVM ka : kategorije) {
				if (!ka.getIme().equals(stara.getIme())) {
					if (ka.getIme().equals(izmenjena.getIme())) {
						return false;
					}
				}
			}
			for (VM mas : masine) {
				if (!mas.getIme().equals(stara.getIme())) {
					if (mas.getIme().equals(izmenjena.getIme())) {
						return false;
					}
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(izmenjena.getIme())) {
					return false;
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
			return true;
		});
		
		post("/izmeniDisk", (req, res) -> {
			Disk[] parametri = g.fromJson(req.body(), Disk[].class);
			Disk stari = parametri[0];
			Disk izmenjeni = parametri[1];

			for (KategorijaVM ka : kategorije) {
				if (!ka.getIme().equals(stari.getIme())) {
					if (ka.getIme().equals(izmenjeni.getIme())) {
						return false;
					}
				}
			}
			for (VM mas : masine) {
				if (!mas.getIme().equals(stari.getIme())) {
					if (mas.getIme().equals(izmenjeni.getIme())) {
						return false;
					}
				}
			}
			for (Disk dis : diskovi) {
				if (!dis.getIme().equals(stari.getIme())) {
					if (dis.getIme().equals(izmenjeni.getIme())) {
						return false;
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
		
		post("/obrisiKategoriju", (req, res) -> {
			KategorijaVM zaBrisanje = g.fromJson(req.body(), KategorijaVM.class);
			
			for (int i = 0; i < kategorije.size(); i++) {
				if (kategorije.get(i).getIme().equals(zaBrisanje.getIme())) {
					
					for (VM masina : masine) {
						if (masina.getKategorija().getIme().equals(zaBrisanje.getIme())) {
							return false;
						}
					}
					kategorije.remove(i);
					upisiUFajl();
					break;
				}
			}
			return true;
		});
		
		post("/obrisiMasinu", (req, res) -> {
			VM zaBrisanje = g.fromJson(req.body(), VM.class);
			
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
			return true;
		});
		
		post("/obrisiDisk", (req, res) -> {
			Disk zaBrisanje = g.fromJson(req.body(), Disk.class);
			
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
		
		post("/dodajKat", (req, res) -> {
			KategorijaVM nova = g.fromJson(req.body(), KategorijaVM.class);
			
			for (KategorijaVM k : kategorije) {
				if (k.getIme().equals(nova.getIme())) {
					return false;
				}
			}
			for (VM mas : masine) {
				if (mas.getIme().equals(nova.getIme())) {
					return false;
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(nova.getIme())) {
					return false;
				}
			}
			
			kategorije.add(nova);
			upisiUFajl();
			return true;
		});
		
		post("/dodajVM", (req, res) -> {
			VM nova = g.fromJson(req.body(), VM.class);
			
			for (KategorijaVM k : kategorije) {
				if (k.getIme().equals(nova.getIme())) {
					return false;
				}
			}
			for (VM mas : masine) {
				if (mas.getIme().equals(nova.getIme())) {
					return false;
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(nova.getIme())) {
					return false;
				}
			}
			
			for (Organizacija organ : organizacije) {
				if (organ.getIme().equals(nova.getOrganizacija())) {
					organ.getResursi().add(nova.getIme());
				}
			}
			
			// TODO : TREBA DA SE DODAJU I DISKOVI
			// TODO : razmisli mozda treba jos nesto, sad me mrzi da razmisljam
			masine.add(nova);
			upisiUFajl();
			return true;
		});
		
		post("/dodajDisk", (req, res) -> {
			Disk novi = g.fromJson(req.body(), Disk.class);
			
			for (KategorijaVM k : kategorije) {
				if (k.getIme().equals(novi.getIme())) {
					return false;
				}
			}
			for (VM mas : masine) {
				if (mas.getIme().equals(novi.getIme())) {
					return false;
				}
			}
			for (Disk d : diskovi) {
				if (d.getIme().equals(novi.getIme())) {
					return false;
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
			
			// TODO : razmisli mozda treba jos nesto, sad me mrzi da razmisljam
			diskovi.add(novi);
			upisiUFajl();
			return true;
		});

		post("/korisniciOrganizacije", (req, res) -> {
			res.type("application/json");
			Organizacija org = g.fromJson(req.body(), Organizacija.class);
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
			return g.toJson(korisniciOrganizacije);
		});
		
		post("/masineIzIsteOrg", (req, res) -> {
			res.type("application/json");
			Disk disk = g.fromJson(req.body(), Disk.class);
			ArrayList<VM> masineIzIsteOrg = new ArrayList<VM>();
			for (VM virtm : masine) {
				if (virtm.getOrganizacija().equals(disk.getOrganizacija())) {
					masineIzIsteOrg.add(virtm);
				}
			}
			return g.toJson(masineIzIsteOrg);
		});
		
		post("/diskoviIzIsteOrg", (req, res) -> {
			res.type("application/json");
			VM virm = g.fromJson(req.body(), VM.class);
			ArrayList<Disk> diskoviIzIsteOrg = new ArrayList<Disk>();
			for (Disk dis : diskovi) {
				if (dis.getOrganizacija().equals(virm.getOrganizacija())) {
					if (dis.getVirtuelnaMasina().equals("") || dis.getVirtuelnaMasina().equals(virm.getIme())) {
						diskoviIzIsteOrg.add(dis);
					}
				}
			}
			return g.toJson(diskoviIzIsteOrg);
		});

		get("/ucitajOrganizacije", (req, res) -> {
			res.type("application/json");
			return g.toJson(organizacije);
		});
		
		get("/ucitajKorisnike", (req, res) -> {
			res.type("application/json");
			return g.toJson(korisnici);
		});
		
		get("/ucitajKategorije", (req, res) -> {
			res.type("application/json");
			return g.toJson(kategorije);
		});
		
		get("/ucitajMasine", (req, res) -> {
			res.type("application/json");
			return g.toJson(masine);
		});
		
		get("/ucitajDiskove", (req, res) -> {
			res.type("application/json");
			return g.toJson(diskovi);
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
