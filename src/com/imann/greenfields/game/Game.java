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
	
	 public Game(String title, int width, int height) {
		 super(title);
		 GLProfile profile = GLProfile.get(GLProfile.GL2);
		 GLCapabilities capabilities = new GLCapabilities(profile);
		 GLCanvas canvas = new GLCanvas(capabilities);
		 canvas.addGLEventListener(this);
		 this.setName(title);
		 this.getContentPane().add(canvas); 
		 this.setSize(width, height);
		 this.setLocationRelativeTo(null);
		 this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		 this.setVisible(true);
		 this.setResizable(false);
		 canvas.requestFocusInWindow();
	 }
	
	public void play () {
		
	}

	
	public void display (GLAutoDrawable drawable) {
		  GL2 gl = drawable.getGL().getGL2();
		  gl.glClear(GL2.GL_COLOR_BUFFER_BIT | GL2.GL_DEPTH_BUFFER_BIT);
		  gl.glFlush();
		  cube(gl.getGL2());
	}
	  
	@Override
	public void init (GLAutoDrawable drawable) {
		 GL2 gl = drawable.getGL().getGL2();
		 gl.glClearColor(0.392f, 0.584f, 0.929f, 1.0f);
	}
	

	private void square(GL2 gl, float r, float g, float b) {
		gl.glColor3f(r,g,b);         // The color for the square.
		gl.glTranslatef(0,0,0.5f);    // Move square 0.5 units forward.
		gl.glNormal3f(0,0,1);        // Normal vector to square (this is actually the default).
		gl.glBegin(GL2.GL_TRIANGLE_FAN);
		gl.glVertex2f(-0.5f,-0.5f);    // Draw the square (before the
		gl.glVertex2f(0.5f,-0.5f);     //   the translation is applied)
		gl.glVertex2f(0.5f,0.5f);      //   on the xy-plane, with its
		gl.glVertex2f(-0.5f,0.5f);     //   at (0,0,0).
		gl.glEnd();
	}

	
	private void cube(GL2 gl) {
		gl.glPushMatrix();
		square(gl,1,0,0);        // front face is red
		gl.glPopMatrix();

		gl.glPushMatrix();
		gl.glRotatef(180,0,1,0); // rotate square to back face
		square(gl,0,1,1);        // back face is cyan
		gl.glPopMatrix();

		gl.glPushMatrix();
		gl.glRotatef(-90,0,1,0); // rotate square to left face
		square(gl,0,1,0);        // left face is green
		gl.glPopMatrix();

		gl.glPushMatrix();
		gl.glRotatef(90,0,1,0); // rotate square to right face
		square(gl,1,0,1);       // right face is magenta
		gl.glPopMatrix();

		gl.glPushMatrix();
		gl.glRotatef(-90,1,0,0); // rotate square to top face
		square(gl,0,0,1);        // top face is blue
		gl.glPopMatrix();

		gl.glPushMatrix();
		gl.glRotatef(90,1,0,0); // rotate square to bottom face
		square(gl,1,1,0);        // bottom face is yellow
		gl.glPopMatrix();

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
