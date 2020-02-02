package beans.model;

import java.util.ArrayList;

public class VM {
	private String ime;
	private KategorijaVM kategorija;
	private int brojJezgara;
	private int RAM;
	private double GPUJezgra;
	private String organizacija;
	private boolean status;
	private ArrayList<String> diskovi;
	private ArrayList<Aktivnost> listaAktivnosti;
	
	public VM() {
		diskovi = new ArrayList<String>();
		listaAktivnosti = new ArrayList<Aktivnost>();
		kategorija = new KategorijaVM();
	}
	
	public VM(String ime, KategorijaVM kategorija, int brojJezgara, int rAM, double gPUJezgra, String organizacija,
			boolean status, ArrayList<String> diskovi, ArrayList<Aktivnost> listaAktivnosti) {
		super();
		this.ime = ime;
		this.kategorija = kategorija;
		this.brojJezgara = brojJezgara;
		this.RAM = rAM;
		this.GPUJezgra = gPUJezgra;
		this.organizacija = organizacija;
		this.status = status;
		this.diskovi = diskovi;
		this.listaAktivnosti = listaAktivnosti;
	}

	public String getIme() {
		return ime;
	}

	public void setIme(String ime) {
		this.ime = ime;
	}

	public KategorijaVM getKategorija() {
		return kategorija;
	}

	public void setKategorija(KategorijaVM kategorija) {
		this.kategorija = kategorija;
		this.brojJezgara = kategorija.getBrojJezgara();
		this.RAM = kategorija.getRAM();
		this.GPUJezgra = kategorija.getGPUJezgra();
	}

	public int getBrojJezgara() {
		return brojJezgara;
	}

	public void setBrojJezgara(int brojJezgara) {
		this.brojJezgara = brojJezgara;
	}

	public int getRAM() {
		return RAM;
	}

	public void setRAM(int RAM) {
		this.RAM = RAM;
	}

	public double getGPUJezgra() {
		return GPUJezgra;
	}

	public void setGPUJezgra(double GPUJezgra) {
		this.GPUJezgra = GPUJezgra;
	}

	public String getOrganizacija() {
		return organizacija;
	}

	public void setOrganizacija(String organizacija) {
		this.organizacija = organizacija;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public ArrayList<String> getDiskovi() {
		return diskovi;
	}

	public void setDiskovi(ArrayList<String> diskovi) {
		this.diskovi = diskovi;
	}

	public ArrayList<Aktivnost> getListaAktivnosti() {
		return listaAktivnosti;
	}

	public void setListaAktivnosti(ArrayList<Aktivnost> listaAktivnosti) {
		this.listaAktivnosti = listaAktivnosti;
	}

	@Override
	public String toString() {
		return "VM [ime=" + ime + ", kategorija=" + kategorija + ", brojJezgara=" + brojJezgara + ", RAM=" + RAM
				+ ", GPUJezgra=" + GPUJezgra + "]";
	}
}
