const Toast = {
	container: null,

	init() {
		if (this.container) return;

		const style = document.createElement("style");
		style.textContent = `
			@keyframes fadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
			.animate-fade-in { animation: fadeIn 0.3s ease-out; }
		`;
		document.head.appendChild(style);

		const div = document.createElement("div");
		div.id = "toast-container";
		div.className = "fixed top-4 right-4 z-50 flex flex-col gap-2";
		document.body.appendChild(div);
		this.container = div;
	},

	show(mensaje, tipo = "info") {
		this.init();

		const colores = {
			success: "bg-green-500",
			error: "bg-red-500",
			warning: "bg-yellow-500",
			info: "bg-blue-500",
		};

		const toast = document.createElement("div");
		toast.className = `${colores[tipo]} text-white px-4 py-3 rounded-lg shadow-lg max-w-md animate-fade-in flex items-center gap-3`;
		toast.innerHTML = `
			<span class="text-sm font-medium">${mensaje}</span>
			<button onclick="this.parentElement.remove()" class="text-white/80 hover:text-white text-xl leading-none">&times;</button>
		`;

		this.container.appendChild(toast);

		setTimeout(() => {
			toast.remove();
		}, 5000);
	},

	success(mensaje) {
		this.show(mensaje, "success");
	},

	error(mensaje) {
		this.show(mensaje, "error");
	},

	warning(mensaje) {
		this.show(mensaje, "warning");
	},

	info(mensaje) {
		this.show(mensaje, "info");
	},
};

window.Toast = Toast;

function esc(str) {
	if (str === null || str === undefined) return "";
	return String(str)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function safeSlice(val, start, end) {
	if (!val || typeof val !== "string") return "";
	return val.slice(start, end);
}

function safeDate(val) {
	if (!val) return "";
	try {
		const d = new Date(val);
		if (isNaN(d.getTime())) return "";
		return d.toLocaleDateString("es-AR");
	} catch {
		return "";
	}
}

function safeStr(val) {
	if (val === null || val === undefined) return "";
	return String(val);
}

window.esc = esc;
window.safeSlice = safeSlice;
window.safeDate = safeDate;
window.safeStr = safeStr;