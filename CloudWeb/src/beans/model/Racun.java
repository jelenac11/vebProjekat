package beans.model;

public class Racun {
	private String resurs;
	private double cena;
	
	public Racun() {
		
	}
	
	public Racun(String resurs, double cena) {
		this.resurs = resurs;
		this.cena = cena;
	}

	public String getResurs() {
		return resurs;
	}
	public void setResurs(String resurs) {
		this.resurs = resurs;
	}
	public double getCena() {
		return cena;
	}
	public void setCena(double cena) {
		this.cena = cena;
	}
}
