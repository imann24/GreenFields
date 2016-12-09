/*
 * Author: Isaiah Mann
 * Description: Runs the main class
 * Adapted From: https://solarianprogrammer.com/2014/12/08/getting-started-jogl-java-opengl-eclipse/ 
 */

package com.imann.greenfields;

import com.imann.greenfields.game.Game;

public class Main { 
	static String title = "Green Fields";
	static int width = 600;
	static int height = 400;
	public static void main(String[] args) {
		Game game = new Game(title, width, height);
		game.play();
	}

}
