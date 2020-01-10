package beans.model;

public class KategorijaVM {
	private String ime;
	private int brojJezgara;
	private int RAM;
	private double GPUJezgra;
	
	public KategorijaVM() {
		
	}
	
	public KategorijaVM(String ime, int brojJezgara, int RAM, double GPUJezgra) {
		this.ime = ime;
		this.brojJezgara = brojJezgara;
		this.RAM = RAM;
		this.GPUJezgra = GPUJezgra;
	}

	public String getIme() {
		return ime;
	}

	public void setIme(String ime) {
		this.ime = ime;
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

	@Override
	public String toString() {
		return "KategorijaVM [ime=" + ime + ", brojJezgara=" + brojJezgara + ", RAM=" + RAM + ", GPUJezgra=" + GPUJezgra
				+ "]";
	}
}
