package beans.model;

import java.util.Date;

public class Aktivnost {
	private Date upaljena;
	private Date ugasena;

	public Aktivnost() {
		
	}
	
	public Aktivnost(Date upaljena, Date ugasena) {
		this.upaljena = upaljena;
		this.ugasena = ugasena;
	}

	public Date getUpaljena() {
		return upaljena;
	}

	public void setUpaljena(Date upaljena) {
		this.upaljena = upaljena;
	}

	public Date getUgasena() {
		return ugasena;
	}

	public void setUgasena(Date ugasena) {
		this.ugasena = ugasena;
	}

	@Override
	public String toString() {
		return "Aktivnost [upaljena=" + upaljena + ", ugasena=" + ugasena + "]";
	}
}
