package beans.model;

import java.util.ArrayList;

public class Organizacija {
	private String ime;
	private String opis;
	private String logoPutanja;
	private ArrayList<String> korisnici;
	private ArrayList<String> resursi;
	
	public Organizacija() {
		korisnici = new ArrayList<String>();
		resursi = new ArrayList<String>();
	}
	
	public Organizacija(String ime, String opis, String logoPutanja, ArrayList<String> korisnici,
			ArrayList<String> resursi) {
		this.ime = ime;
		this.opis = opis;
		this.logoPutanja = logoPutanja;
		this.korisnici = korisnici;
		this.resursi = resursi;
	}

	public String getIme() {
		return ime;
	}

	public void setIme(String ime) {
		this.ime = ime;
	}

	public String getOpis() {
		return opis;
	}

	public void setOpis(String opis) {
		this.opis = opis;
	}

	public String getLogoPutanja() {
		return logoPutanja;
	}

	public void setLogoPutanja(String logoPutanja) {
		this.logoPutanja = logoPutanja;
	}

	public ArrayList<String> getKorisnici() {
		return korisnici;
	}

	public void setKorisnici(ArrayList<String> korisnici) {
		this.korisnici = korisnici;
	}

	public ArrayList<String> getResursi() {
		return resursi;
	}

	public void setResursi(ArrayList<String> resursi) {
		this.resursi = resursi;
	}

	@Override
	public String toString() {
		return "Organizacija [ime=" + ime + ", " + "logoPutanja=" + logoPutanja + "]";
	}
}
