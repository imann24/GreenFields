/*
 * Author: Isaiah Mann
 * Description: Main Game Object
 * Adapted From: https://solarianprogrammer.com/2014/12/08/getting-started-jogl-java-opengl-eclipse/ 
 */

package com.imann.greenfields.game;
import com.jogamp.opengl.GL2;
import com.jogamp.opengl.GLAutoDrawable;
import com.jogamp.opengl.GLCapabilities;
import com.jogamp.opengl.GLEventListener;
import com.jogamp.opengl.GLProfile;
import com.jogamp.opengl.awt.GLCanvas;

import javax.swing.JFrame;

public class Game extends JFrame implements GLEventListener {
	private static final long serialVersionUID = 1L;
	float rquad = 0;
	public Game (String title, int width, int height) {
		super(title);
		GLProfile profile = GLProfile.get(GLProfile.GL2);
		GLCapabilities capabilities = new GLCapabilities(profile);
		GLCanvas canvas = new GLCanvas(capabilities);
		this.getContentPane().add(canvas);
		this.setName(title);
		this.setSize(width, height);
		this.setLocationRelativeTo(null);
		this.setVisible(true);
		this.setResizable(false);
		canvas.requestFocusInWindow();
	}
	
	public void play () {
		
	}
	
	@Override
	public void display (GLAutoDrawable drawable) {
		final GL2 gl = drawable.getGL().getGL2();
	      gl.glTranslatef( 0f, 0f, -2.5f );
	      gl.glBegin( GL2.GL_LINES );
	      gl.glVertex3f( -0.75f,0f,0 );
	      gl.glVertex3f( 0f,-0.75f, 0 );
	      gl.glEnd();
	      
	      //3d line
	      gl.glBegin( GL2.GL_LINES );
	      gl.glVertex3f( -0.75f,0f,3f );// 3 units into the window
	      gl.glVertex3f( 0f,-0.75f,3f );
	      gl.glEnd();
	}
	
	@Override
	public void init (GLAutoDrawable drawable) {
	      
	}
	
	@Override
	public void dispose (GLAutoDrawable drawable) {
		// NOTHING
	}
	
	@Override
	public void reshape (GLAutoDrawable drawable,
			int x, int y, int width, int height) {
		// NOTHING		
	}
	 
}
