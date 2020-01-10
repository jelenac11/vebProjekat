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

import beans.model.Korisnik;
import beans.model.Organizacija;
import beans.model.Uloga;
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

//		korisnici.add(new Korisnik("super@admin", "sa", "Super", "Admin", "nema", Uloga.SUPER_ADMIN));
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
	}
}
