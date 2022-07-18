const main = document.querySelector('main');
const formInput = document.querySelector('.item-content--form form');

// Ambil data-data yang telah diinputkan ketika user sudah submit
formInput.addEventListener('submit', function (e) {
	e.preventDefault();
	sendDataUser();
});

// Untuk melakukan validasi pada kota dituju dan jumlah orang
const totalPeople = document.getElementById('total-people');
const city = document.getElementById('city');

// Data semua kota yang dituju
const listCities = [...document.querySelectorAll('#list-city option')];

// Mengirim data-data yang telah diinputkan sekaligus memvalidasi nya
function sendDataUser() {
	const listCityToLowerCase = listCities.map((city) => {
		return city.value.toLowerCase();
	});
	const cityValueToLowerCase = city.value.toLowerCase();

	if (!listCityToLowerCase.includes(cityValueToLowerCase)) {
		city.value = '';
	} else if (totalPeople.value === '0') {
		totalPeople.value = '';
	} else {
		main.classList.add('active');
		getInputValueUser();
	}
}

// Kembali ke bagian form pembelian tiket, ketika user menekan bagian ubah
const btnEditPaymentTicket = document.querySelector('.btn--edit');
btnEditPaymentTicket.addEventListener('click', function () {
	main.classList.remove('active');
});

// Menerapkan kota-kota yang tersedia pada kota yang dituju
const discount = document.getElementById('discount');

for (const listCity of listCities) {
	city.addEventListener('change', function () {
		const cityValueToLowerCase = city.value.toLowerCase();
		const listCityToLowerCase = listCity.value.toLowerCase();

		if (cityValueToLowerCase === listCityToLowerCase) {
			const cityDiscount = listCity.dataset.discount || 0;
			discount.value = `${cityDiscount}%`;
		}
	});
}

// Mengambil data-data dari kolom input yang telah diisi oleh user
function getInputValueUser() {
	const name = document.getElementById('name').value;
	const status = document.getElementById('status').value;
	const paymentMethod = document.getElementById('payment-method').value;

	printInputValueUser(name, city.value, status, totalPeople.value, paymentMethod, discount.value);
}

function printInputValueUser(name, city, status, totalPeople, paymentMethod, discount) {
	const valueOutputs = [...document.querySelectorAll('.value-output')];

	const [outputName, outputCity, outputStatus, outputTotalPeople, outputPriceTicket, outputSubtotal, outputDiscount, outputTotalPayment, outputPaymentMethod] = valueOutputs;

	// Menampilkan nama user
	outputName.textContent = name;

	// Menampilkan kota yang dituju
	outputCity.textContent = city;

	// Menampilkan status apakah Dewasa atau Anak-anak
	outputStatus.textContent = status;

	// Menampilkan jumlah orang atau beli berapa tiket
	outputTotalPeople.textContent = totalPeople;

	// Menampilkan harga tiket sesuai dengan status yang diplih
	outputPriceTicket.textContent = `Rp ${outputStatus.textContent === 'Dewasa' ? '150.000' : '80.000'}`;

	// Melakukan perkalian pada subtotal
	const sumSubtotal = parseInt(outputPriceTicket.textContent.replace('Rp', '').split('.').join('') * outputTotalPeople.textContent);

	// Mengubah tanda koma menjadi titik
	outputSubtotal.textContent = `Rp ${sumSubtotal.toLocaleString().replaceAll(',', '.')}`;

	// Menampilkan diskon
	outputDiscount.textContent = discount;

	// Menghapu tanda persen pada diskon
	const removePercentOfDiscount = outputDiscount.textContent.replace('%', '');

	// Melakukan perhitungan apabila ada diskon
	const sumTotalPayment =
		removePercentOfDiscount === '0'
			? outputSubtotal.textContent
			: parseInt((outputSubtotal.textContent.replace('Rp ', '').replaceAll('.', '') / 100) * (100 - removePercentOfDiscount))
					.toLocaleString()
					.replaceAll(',', '.');

	// Menampilkan jumlah pembayaran
	outputTotalPayment.textContent = `Rp ${sumTotalPayment}`;

	// Menampilkan metode pembayaran yang dipilih
	outputPaymentMethod.textContent = paymentMethod;
}

// Popup konfirmasi
const popupConfirmation = document.querySelector('.popup-confirmation');
// popupConfirmation.addEventListener

// Ketika user membayar konfirmasi tiket
const btnPay = document.getElementById('btn-pay');
btnPay.addEventListener('click', function () {
	popupConfirmation.classList.add('show');
});

// Ketika user memilih tombol belum saat konfirmasi popup
const btnNoConfirmation = document.querySelector('.btn--no');
btnNoConfirmation.addEventListener('click', function () {
	popupConfirmation.classList.remove('show');
});

// Ketika user mengkonfirmasi bahwa detail data formulir tiket sudah benar dibagian popup konfirmasi
const btnConfirmation = document.querySelector('.btn--yes');
btnConfirmation.addEventListener('click', function () {
	// Mengubah text konfirmasi tiket data pembelian, menjadi mohon menunggu sebentar...
	const descriptionPopupConfirmation = document.querySelector('.description-popup-confirmation');
	descriptionPopupConfirmation.textContent = 'Mohon menunggu sebentar...';

	// Mengubah dari text sudah menjadi icon loading
	this.innerHTML = `
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="loader">
								<path fill="none" d="M0 0h24v24H0z" />
								<path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z" fill="rgba(255,255,255,1)" />
							</svg>
						`;

	// Menghilangkan tombol belum
	btnNoConfirmation.style.display = 'none';

	// Mengubah tampilan ketika semua transaksi sudah selesai

	// Memberikan sedikit efek loading sekitar 3detik
	setTimeout(() => {
		popupConfirmation.classList.remove('show');
		main.classList.replace('active', 'success');
	}, 3000);
});

// Menambahkan popup check detail data ketika text lihat detail data pembelian tiket di klik
const popupCheckDetailData = document.querySelector('.popup-check-detail-data');

const detailDataPayment = document.querySelector('.detail-data-payment');
detailDataPayment.addEventListener('click', function () {
	// Menambahkan popup check detail data
	popupCheckDetailData.classList.add('show');

	// Mengambil isi dari bagian konfirmasi data-data detail
	const confirmationDetail = document.querySelector('.item-content--output-payment .confirmation-detail');

	// Isi dari check detail data
	const checkDetailData = popupCheckDetailData.querySelector('.check-detail-data');

	// Mengubah bagian isi dari check detail data, menjadi data-data saat proses konfirmasi data pembelian tiket
	checkDetailData.innerHTML = `<h2 class="title-check-detail-data">Detail data:</h2>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" class="close-detail-data">
						<path fill="none" d="M0 0h24v24H0z" />
						<path
							d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415L12 10.586z"
							fill="rgba(255,61,61,1)"
						/>
					</svg>
					
					${confirmationDetail.innerHTML}`;

	closePopupDetail();
});

// Function untuk menghapus popup check detail data
function closePopupDetail() {
	const closePopupCheckDetail = document.querySelector('.close-detail-data');
	closePopupCheckDetail.addEventListener('click', function () {
		popupCheckDetailData.classList.remove('show');
	});
}
