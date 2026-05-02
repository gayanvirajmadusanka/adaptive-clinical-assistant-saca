package org.saca.controller;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.canvas.Canvas;
import javafx.scene.canvas.GraphicsContext;
import javafx.scene.control.Label;
import javafx.scene.paint.Color;
import javafx.scene.shape.ArcType;
import javafx.util.Duration;
import org.saca.utility.manager.LanguageManager;

import java.net.URL;
import java.util.ResourceBundle;

public class LoadingController implements Initializable {

    private static final double TRACK_WIDTH = 18;

    private static final double SIZE = 200;

    private static final Color TRACK_COLOR = Color.web("#e8d5b0");

    private static final Color ARC_START = Color.web("#b07030");

    private static final Color ARC_END = Color.web("#d4a060");

    @FXML
    private SidebarController sidebarController;

    @FXML
    private Canvas progressCanvas;

    @FXML
    private Label percentLabel;

    @FXML
    private Label loadingTitle;

    private String title = LanguageManager.get("loading");

    private int durationMs = 3000;

    private Runnable onCompleteAction = null;

    private double progress = 0.0;

    private Timeline timeline;

    @Override
    public void initialize(URL url, ResourceBundle rb) {
        drawRing(0);
        Platform.runLater(this::startAnimation);
    }

    /**
     * Set the header label text.
     */
    public void setTitle(String title) {
        this.title = title;
        if (loadingTitle != null) loadingTitle.setText(title);
    }

    /**
     * Set animation duration in ms.
     * Pass Integer.MAX_VALUE to run indefinitely until stop() is called.
     */
    public void setDuration(int durationMs) {
        this.durationMs = durationMs;
    }

    /**
     * Callback fired when fixed-duration animation completes.
     */
    public void setOnComplete(Runnable onCompleteAction) {
        this.onCompleteAction = onCompleteAction;
    }

    /**
     * Stop the animation — call this when API responds.
     */
    public void stop() {
        if (timeline != null) {
            timeline.stop();
        }
    }

    /**
     * Get the canvas to access the scene for navigation.
     */
    public Canvas getCanvas() {
        return progressCanvas;
    }

    private void startAnimation() {
        if (loadingTitle != null) loadingTitle.setText(title);
        if (durationMs == Integer.MAX_VALUE) {
            startIndefiniteAnimation();
        } else {
            startFixedAnimation();
        }
    }

    /**
     * Fixed duration — animates 0% → 100% then fires onComplete.
     */
    private void startFixedAnimation() {
        int steps = 100;
        double stepDuration = (double) durationMs / steps;

        timeline = new Timeline();
        for (int i = 1; i <= steps; i++) {
            final double p = i / (double) steps;
            timeline.getKeyFrames().add(new KeyFrame(
                    Duration.millis(stepDuration * i),
                    e -> {
                        progress = p;
                        drawRing(progress);
                        percentLabel.setText((int) (progress * 100) + "%");
                    }
            ));
        }

        timeline.setOnFinished(e -> Platform.runLater(() -> {
            if (onCompleteAction != null) onCompleteAction.run();
        }));

        timeline.play();
    }

    /**
     * Indefinite mode — pulses between 15% and 85% until stop() is called.
     */
    private void startIndefiniteAnimation() {
        final double[] p = {0.15};
        final double[] dir = {1};   // 1 = forward, -1 = backward
        final double step = 0.005;
        final double minProg = 0.15;
        final double maxProg = 0.85;

        timeline = new Timeline(new KeyFrame(Duration.millis(16), e -> {
            p[0] += dir[0] * step;
            if (p[0] >= maxProg) dir[0] = -1;
            if (p[0] <= minProg) dir[0] = 1;

            drawRing(p[0]);
            percentLabel.setText((int) (p[0] * 100) + "%");
        }));

        timeline.setCycleCount(Timeline.INDEFINITE);
        timeline.play();
    }

    private void drawRing(double progress) {
        GraphicsContext gc = progressCanvas.getGraphicsContext2D();
        gc.clearRect(0, 0, SIZE, SIZE);

        double cx = SIZE / 2;
        double cy = SIZE / 2;
        double radius = (SIZE / 2) - TRACK_WIDTH;
        double x = cx - radius;
        double y = cy - radius;
        double diam = radius * 2;

        // Background track
        gc.setStroke(TRACK_COLOR);
        gc.setLineWidth(TRACK_WIDTH);
        gc.strokeOval(x, y, diam, diam);

        if (progress <= 0) return;

        double sweepAngle = 360.0 * progress;
        double startAngle = 90;
        int segments = 120;
        double segAngle = sweepAngle / segments;
        int drawn = (int) (segments * progress);

        for (int i = 0; i < drawn; i++) {
            double t = (double) i / Math.max(segments - 1, 1);
            Color segColor = interpolateColor(ARC_START, ARC_END, t);
            double angle = startAngle - i * segAngle;

            gc.setStroke(segColor);
            gc.setLineWidth(TRACK_WIDTH);
            gc.strokeArc(x, y, diam, diam, angle, -segAngle - 0.5, ArcType.OPEN);
        }

        // Rounded tip cap
        double tipAngle = Math.toRadians(startAngle - sweepAngle);
        double capRadius = TRACK_WIDTH / 2;
        double tipX = cx + radius * Math.cos(tipAngle);
        double tipY = cy - radius * Math.sin(tipAngle);
        gc.setFill(ARC_END);
        gc.fillOval(tipX - capRadius, tipY - capRadius, capRadius * 2, capRadius * 2);

        // Rounded start cap
        double startRad = Math.toRadians(startAngle);
        double startX = cx + radius * Math.cos(startRad);
        double startY = cy - radius * Math.sin(startRad);
        gc.setFill(ARC_START);
        gc.fillOval(startX - capRadius, startY - capRadius, capRadius * 2, capRadius * 2);
    }

    private Color interpolateColor(Color from, Color to, double t) {
        return new Color(
                clamp(from.getRed() + (to.getRed() - from.getRed()) * t),
                clamp(from.getGreen() + (to.getGreen() - from.getGreen()) * t),
                clamp(from.getBlue() + (to.getBlue() - from.getBlue()) * t),
                1.0
        );
    }

    private double clamp(double v) {
        return Math.max(0, Math.min(1, v));
    }
}
