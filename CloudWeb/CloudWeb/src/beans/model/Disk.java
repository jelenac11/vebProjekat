package beans.model;

public class Disk {
	private String ime;
	private TipDiska tip;
	private double kapacitet;
	private String virtuelnaMasina;
	
	public Disk() {
		
	}
	
	public Disk(String ime, TipDiska tip, double kapacitet, String virtuelnaMasina) {
		this.ime = ime;
		this.tip = tip;
		this.kapacitet = kapacitet;
		this.virtuelnaMasina = virtuelnaMasina;
	}

	public String getIme() {
		return ime;
	}

	public void setIme(String ime) {
		this.ime = ime;
	}

	public TipDiska getTip() {
		return tip;
	}

	public void setTip(TipDiska tip) {
		this.tip = tip;
	}

	public double getKapacitet() {
		return kapacitet;
	}

	public void setKapacitet(double kapacitet) {
		this.kapacitet = kapacitet;
	}

	public String getVirtuelnaMasina() {
		return virtuelnaMasina;
	}

	public void setVirtuelnaMasina(String virtuelnaMasina) {
		this.virtuelnaMasina = virtuelnaMasina;
	}

	@Override
	public String toString() {
		return "Disk [ime=" + ime + ", tip=" + tip + ", kapacitet=" + kapacitet + "]";
	}
}
