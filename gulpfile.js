"use strict";

import gulp from "gulp";
import pug from "gulp-pug";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import server from "browser-sync";
import scss from "gulp-dart-sass";
import autoprefixer from "gulp-autoprefixer";
import concat from "gulp-concat";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import newer from "gulp-newer";
import minify from "gulp-jsmin";
import sourcemaps from "gulp-sourcemaps";
import clean from "gulp-clean";

const {
	src,
	dest,
	parallel,
	watch
} = gulp;

const pugfiles = () => {
	return src("src/*.pug")
		.pipe(plumber())
		.pipe(
			pug({
				pretty: true,
			})
		)
		.pipe(dest("./_www"));
};

const serve = () => {
	server.init({
		server: {
			baseDir: "./_www"
		},
		notify: false,
		online: true,
	});
};

const styles = () => {
	return src("src/scss/*.scss")
		.pipe(plumber({
			errorHandler: notify.onError(error => ({
				title: "scss",
				message: error.message
			}))
		}))
		.pipe(sourcemaps.init())
		.pipe(scss({
			outputStyle: "compressed"
		}).on("error", scss.logError))
		// .pipe(autoprefixer())
		.pipe(concat("style.min.css"))
		.pipe(sourcemaps.write("../maps"))
		.pipe(dest("_www/css"))
		.pipe(server.stream());
};

const scripts = () => {
	return src("src/js/*.js")
		.pipe(plumber())
		.pipe(concat("main.min.js"))
		.pipe(minify())
		.pipe(dest("_www/js"));
};

const images = () => {
	return src("src/img/**/*")
		.pipe(newer("_www/img/"))
		.pipe(imagemin())
		.pipe(webp())
		.pipe(dest("_www/img"));
};

export const cln = () => {
	return src("_www")
		.pipe(clean("_www"));
}

const watcher = () => {
	watch("src/**/*.pug", pugfiles).on("change", server.reload);
	watch("src/**/*.scss", styles);
	watch(["src/js/**/*.js", "!src/js/**/*.min.js"], scripts).on(
		"change",
		server.reload
	);
	watch("src/img/**/*", images);
};

export default parallel(pugfiles, serve, watcher, styles, scripts, images);