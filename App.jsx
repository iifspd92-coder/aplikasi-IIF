import React, { useState, useEffect } from "react";

// Generator RPM IIF SADEWA GOA
// Single-file React component. Uses Tailwind CSS for styling.
// Usage: include in a React project with Tailwind configured.

export default function App() {
  // --- Auth ---
  const ADMIN_USERNAME = "IIF SADEWA GOA"; // hardcoded, not shown in UI
  const ADMIN_PASSWORD = "29021996"; // hardcoded, not shown in UI

  const [user, setUser] = useState(null); // {role: 'admin'|'participant', name}
  const [view, setView] = useState("login");

  // tokens stored in localStorage under 'rpm_tokens'
  const [tokens, setTokens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rpm_tokens") || "[]");
    } catch { return []; }
  });

  useEffect(() => localStorage.setItem("rpm_tokens", JSON.stringify(tokens)), [tokens]);

  // --- Form state ---
  const initial = {
    sekolah: "",
    guru: "",
    nipGuru: "",
    kepala: "",
    nipKepala: "",
    jenjang: "SD",
    kelas: "1",
    mapel: "",
    capaianPembelajaran: "",
    tujuanPembelajaran: "",
    materiPelajaran: "",
    jumlahPertemuan: 1,
    durasiPertemuan: "2 x 35 menit",
    praktikPerPertemuan: [], // array length = jumlahPertemuan of choices
    dimensiLulusan: [],
  };
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  // --- helpers ---
  const pedagogies = [
    "Inkuiri-Discovery",
    "PjBL",
    "Problem Based Learning",
    "Game Based Learning",
    "Station Learning",
  ];

  const dimensiOptions = [
    "Keimanan & Ketakwaan",
    "Kewargaan",
    "Penalaran Kritis",
    "Kreativitas",
    "Kolaborasi",
    "Kemandirian",
    "Kesehatan",
    "Komunikasi",
  ];

  function validate() {
    const e = {};
    if (!form.sekolah) e.sekolah = "Nama Satuan Pendidikan wajib diisi";
    if (!form.guru) e.guru = "Nama Guru wajib diisi";
    if (!form.nipGuru) e.nipGuru = "NIP Guru wajib diisi";
    if (!form.kepala) e.kepala = "Nama Kepala Sekolah wajib diisi";
    if (!form.nipKepala) e.nipKepala = "NIP Kepala Sekolah wajib diisi";
    if (!form.mapel) e.mapel = "Mata Pelajaran wajib diisi";
    if (!form.capaianPembelajaran) e.capaianPembelajaran = "Capaian Pembelajaran wajib diisi";
    if (!form.tujuanPembelajaran) e.tujuanPembelajaran = "Tujuan Pembelajaran wajib diisi";
    if (!form.materiPelajaran) e.materiPelajaran = "Materi Pelajaran wajib diisi";
    if (!form.jumlahPertemuan || form.jumlahPertemuan < 1) e.jumlahPertemuan = "Jumlah Pertemuan harus angka >= 1";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // generate pedagogic choice array when jumlahPertemuan changes
  useEffect(() => {
    const n = parseInt(form.jumlahPertemuan || 0, 10) || 0;
    setForm(prev => {
      const copy = { ...prev };
      copy.praktikPerPertemuan = Array.from({ length: n }, (_, i) => (copy.praktikPerPertemuan[i] || pedagogies[0]));
      return copy;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.jumlahPertemuan]);

  // --- generation helpers ---
  function generateSiswaDescription() {
    return `Siswa kelas ${form.kelas} pada jenjang ${form.jenjang} yang memiliki variasi kemampuan, minat, dan gaya belajar. Sebagian besar memerlukan pembelajaran yang interaktif dan kontekstual.`;
  }

  function generateLintasDisiplin() {
    // simple heuristic: split materi words -> suggest disciplines
    const text = (form.materiPelajaran || "").toLowerCase();
    const suggestions = [];
    if (/angka|bilang|operasi|pecahan|persen/.test(text)) suggestions.push("Matematika");
    if (/sejarah|peristiwa|negara|peta|geografi/.test(text)) suggestions.push("Ilmu Pengetahuan Sosial");
    if (/tumbuhan|hewan|sistem|organ|energi|suhu/.test(text)) suggestions.push("Ilmu Pengetahuan Alam");
    if (/bahasa|teks|menulis|membaca|cerita/.test(text)) suggestions.push("Bahasa Indonesia");
    if (/seni|musik|gambar|melukis/.test(text)) suggestions.push("Seni Budaya");
    if (suggestions.length === 0) suggestions.push("Teknologi & Rekayasa");
    return suggestions.join(", ");
  }

  function generateKemitraan() {
    return "Perpustakaan sekolah, organisasi lingkungan hidup setempat, museum/kantor dinas terkait, komunitas STEM lokal, dan/atau orang tua/wali kelas sebagai narasumber/mitra kegiatan.";
  }

  function generateLingkunganPembelajaran() {
    return "Ruang kelas hybrid (distribusi kelompok), laboratorium sederhana, luar ruangan (jika relevan), dan ruang presentasi untuk diskusi serta area praktek.";
  }

  function generatePemanfaatanDigital() {
    return (
      "Pemanfaatan platform: Google Workspace (Google Docs/Sheets/Slides), Padlet untuk kolaborasi, Kahoot!/Quizziz untuk asesmen cepat, Canva for Education untuk produk kreatif, Google Jamboard/Whiteboard, dan platform LMS sederhana (Moodle/Google Classroom)."
    );
  }

  function generateTopik() {
    // try to extract short topic from materi
    const m = form.materiPelajaran || "";
    if (!m) return "-";
    const parts = m.split(/[\.\n\;]+/).map(s => s.trim()).filter(Boolean);
    return parts[0].slice(0, 120);
  }

  // --- produce a printable HTML table string ---
  function renderRPMHtml() {
    // Build table-like HTML that will be copied/printed
    const siswa = generateSiswaDescription();
    const lintas = generateLintasDisiplin();
    const mitra = generateKemitraan();
    const lingkungan = generateLingkunganPembelajaran();
    const digital = generatePemanfaatanDigital();
    const topik = generateTopik();

    // Build rows for each pertemuan
    const pertemuanRows = form.praktikPerPertemuan.map((praktik, idx) => {
      const nomor = idx + 1;
      const memahami = `${praktik === 'Game Based Learning' ? 'mengamati dan berdiskusi' : 'mendengar dan membaca secara aktif'}; kegiatan awal: apersepsi dan pengait relevan.`;
      const mengaplikasi = `Kegiatan inti (${praktik}): langkah sintaks utama disesuaikan - siswa melakukan tugas praktis, kolaborasi, dan pembuatan produk.`;
      const refleksi = `Siswa merefleksikan hasil melalui tanya jawab dan catatan portofolio.`;

      return `
        <tr>
          <td class="border p-2 text-sm">${nomor}</td>
          <td class="border p-2 text-sm">${praktik}</td>
          <td class="border p-2 text-sm">${memahami}</td>
          <td class="border p-2 text-sm">${mengaplikasi}</td>
          <td class="border p-2 text-sm">${refleksi}</td>
        </tr>
      `;
    }).join('\n');

    const html = `
    <div class="max-w-6xl mx-auto p-6 font-sans text-sm">
      <h2 class="text-xl font-semibold mb-4">Rencana Pembelajaran Mendalam (RPM) - Generator RPM IIF SADEWA GOA</h2>

      <table class="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th class="border p-2 text-left">Identitas</th>
            <th class="border p-2 text-left">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border p-2 align-top">Nama Satuan Pendidikan</td>
            <td class="border p-2">${form.sekolah}</td>
          </tr>
          <tr>
            <td class="border p-2">Mata Pelajaran</td>
            <td class="border p-2">${form.mapel}</td>
          </tr>
          <tr>
            <td class="border p-2">Kelas / Semester</td>
            <td class="border p-2">${form.kelas} / 1</td>
          </tr>
          <tr>
            <td class="border p-2">Durasi Pertemuan</td>
            <td class="border p-2">${form.durasiPertemuan} (Jumlah pertemuan: ${form.jumlahPertemuan})</td>
          </tr>
        </tbody>
      </table>

      <table class="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th class="border p-2 text-left">Identifikasi</th>
            <th class="border p-2 text-left">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border p-2">Siswa</td>
            <td class="border p-2">${siswa}</td>
          </tr>
          <tr>
            <td class="border p-2">Materi Pelajaran</td>
            <td class="border p-2">${form.materiPelajaran}</td>
          </tr>
          <tr>
            <td class="border p-2">Capaian Dimensi Lulusan</td>
            <td class="border p-2">${form.dimensiLulusan.join(', ')}</td>
          </tr>
        </tbody>
      </table>

      <table class="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th class="border p-2 text-left">Desain Pembelajaran</th>
            <th class="border p-2 text-left">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="border p-2">Capaian Pembelajaran</td><td class="border p-2">${form.capaianPembelajaran}</td></tr>
          <tr><td class="border p-2">Lintas Disiplin Ilmu</td><td class="border p-2">${lintas}</td></tr>
          <tr><td class="border p-2">Tujuan Pembelajaran</td><td class="border p-2">${form.tujuanPembelajaran}</td></tr>
          <tr><td class="border p-2">Topik Pembelajaran</td><td class="border p-2">${topik}</td></tr>
          <tr><td class="border p-2">Kemitraan Pembelajaran</td><td class="border p-2">${mitra}</td></tr>
          <tr><td class="border p-2">Lingkungan Pembelajaran</td><td class="border p-2">${lingkungan}</td></tr>
          <tr><td class="border p-2">Pemanfaatan Digital</td><td class="border p-2">${digital}</td></tr>
        </tbody>
      </table>

      <h3 class="font-medium mb-2">Pengalaman Belajar - Rincian per Pertemuan</h3>
      <table class="w-full border-collapse mb-4">
        <thead>
          <tr>
            <th class="border p-2">Pertemuan</th>
            <th class="border p-2">Praktik Pedagogis</th>
            <th class="border p-2">Memahami (Kegiatan Awal)</th>
            <th class="border p-2">Mengaplikasi (Kegiatan Inti)</th>
            <th class="border p-2">Refleksi (Kegiatan Penutup)</th>
          </tr>
        </thead>
        <tbody>
          ${pertemuanRows}
        </tbody>
      </table>

      <h3 class="font-medium mb-2">Asesmen Pembelajaran</h3>
      <table class="w-full border-collapse mb-12">
        <tbody>
          <tr><td class="border p-2">Asesmen Awal</td><td class="border p-2">Diagnostik singkat, apersepsi, cek prasyarat.</td></tr>
          <tr><td class="border p-2">Asesmen Proses</td><td class="border p-2">Observasi, rubrik penilaian, diskusi, catatan portofolio.</td></tr>
          <tr><td class="border p-2">Asesmen Akhir</td><td class="border p-2">Produk tugas, presentasi kelompok/individu, portofolio digital.</td></tr>
        </tbody>
      </table>

      <div class="flex justify-between mt-12">
        <div class="text-left">
          <div>Mengetahui,</div>
          <div class="mt-12">( ${form.kepala || '________________'} )</div>
          <div>NIP: ${form.nipKepala || '________________'}</div>
        </div>
        <div class="text-right">
          <div>Guru Mata Pelajaran,</div>
          <div class="mt-12">( ${form.guru || '________________'} )</div>
          <div>NIP: ${form.nipGuru || '________________'}</div>
        </div>
      </div>

    </div>
    `;

    return html;
  }

  // copy & open Google Docs (cannot auto-paste for security) -> copy to clipboard then open new tab
  async function handleCopyAndOpenDocs() {
    const html = renderRPMHtml();
    try {
      await navigator.clipboard.writeText(html);
      window.open('https://docs.google.com/document/create', '_blank');
      alert('Konten RPM telah disalin ke clipboard. Silakan buka tab Google Dokumen yang terbuka lalu paste (Ctrl+V / Cmd+V) untuk menempelkan tabel dengan rapi. (Karena pembatasan browser, aplikasi tidak dapat otomatis menempelkan ke Google Docs)');
    } catch (err) {
      alert('Gagal menyalin ke clipboard. Silakan blok dan salin manual dari pratinjau.');
    }
  }

  function handlePrint() {
    // Render a printable window
    const html = renderRPMHtml();
    const w = window.open('', '_blank');
    w.document.write('<html><head><title>RPM - Cetak</title>');
    w.document.write('<meta charset="utf-8"/>');
    w.document.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">');
    w.document.write('</head><body>');
    w.document.write(html);
    w.document.write('</body></html>');
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  }

  // --- admin actions: create token ---
  function createTokenForParticipant(name) {
    const t = Math.random().toString(36).slice(2, 10).toUpperCase();
    const tokenObj = { token: t, createdBy: user?.name || 'admin', for: name || 'participant' };
    setTokens(prev => [tokenObj, ...prev]);
    return tokenObj;
  }

  // --- UI ---
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl font-semibold mb-4">Generator RPM IIF SADEWA GOA</h1>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LoginForm
                onAdminLogin={(name) => { setUser({ role: 'admin', name }); setView('form'); }}
                onParticipantLogin={(token, name) => {
                  // validate token
                  const ok = tokens.find(t => t.token === token);
                  if (!ok) return alert('Token tidak valid. Hubungi admin.');
                  setUser({ role: 'participant', name: name || 'Peserta' });
                  setView('form');
                }}
                adminCreds={{ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }}
              />
            </div>

            <div className="border-l pl-4">
              <h2 className="font-medium">Petunjuk singkat</h2>
              <ol className="list-decimal pl-5 mt-2 text-sm space-y-2">
                <li>Isi formulir RPM sesuai format input yang wajib diisi.</li>
                <li>Pastikan semua isian wajib terisi untuk mengaktifkan tombol <em>Generate</em>.</li>
                <li>Admin dapat membuat token untuk peserta dari menu admin (setelah login admin).</li>
                <li>Gunakan tombol <em>Salin & Buka di Google Dokumen</em> lalu paste di Google Docs untuk menyimpan dan mencetak.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Generator RPM IIF SADEWA GOA</h1>
          <div className="space-x-2">
            {user?.role === 'admin' && (
              <button className="px-3 py-1 border rounded" onClick={() => setView('admin')}>Admin Panel</button>
            )}
            <button className="px-3 py-1 border rounded" onClick={() => { setUser(null); setView('login'); }}>Logout</button>
          </div>
        </div>

        {view === 'admin' && user?.role === 'admin' && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-medium">Panel Admin - Token Peserta</h2>
            <CreateTokenForm onCreate={(name) => {
              const t = createTokenForParticipant(name);
              alert(`Token dibuat: ${t.token} (untuk: ${t.for}). Tampilkan token hanya kepada peserta yang akan menggunakannya.`);
            }} />

            <div className="mt-4">
              <h3 className="font-medium">Daftar Token (disimpan lokal)</h3>
              <div className="mt-2 text-sm">
                {tokens.length === 0 ? <div>Belum ada token.</div> : (
                  <ul className="list-disc pl-5 space-y-1">
                    {tokens.map((t, i) => <li key={i}>{t.token} — untuk: {t.for} (dibuat oleh: {t.createdBy})</li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'form' && (
          <div className="bg-white p-4 rounded shadow">
            <form onSubmit={(e) => { e.preventDefault(); if (!validate()) return; setView('preview'); }}>
              <h2 className="font-medium mb-4">Form Input - RPM</h2>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Nama Satuan Pendidikan" value={form.sekolah} onChange={v => setForm({ ...form, sekolah: v })} error={errors.sekolah} />
                <Input label="Mata Pelajaran" value={form.mapel} onChange={v => setForm({ ...form, mapel: v })} error={errors.mapel} />
                <Input label="Nama Guru" value={form.guru} onChange={v => setForm({ ...form, guru: v })} error={errors.guru} />
                <Input label="NIP Guru" value={form.nipGuru} onChange={v => setForm({ ...form, nipGuru: v })} error={errors.nipGuru} />
                <Input label="Nama Kepala Sekolah" value={form.kepala} onChange={v => setForm({ ...form, kepala: v })} error={errors.kepala} />
                <Input label="NIP Kepala Sekolah" value={form.nipKepala} onChange={v => setForm({ ...form, nipKepala: v })} error={errors.nipKepala} />

                <div>
                  <label className="block text-sm">Pilihan Jenjang Pendidikan</label>
                  <select className="mt-1 block w-full border rounded p-2" value={form.jenjang} onChange={e => setForm({ ...form, jenjang: e.target.value })}>
                    <option>SD</option>
                    <option>SMP</option>
                    <option>SMA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm">Pilihan Kelas sesuai jenjang</label>
                  <select className="mt-1 block w-full border rounded p-2" value={form.kelas} onChange={e => setForm({ ...form, kelas: e.target.value })}>
                    {Array.from({ length: (form.jenjang === 'SD' ? 6 : form.jenjang === 'SMP' ? 3 : 3) }, (_, i) => i + 1).map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm">Capaian Pembelajaran (CP)</label>
                  <textarea className="mt-1 block w-full border rounded p-2" value={form.capaianPembelajaran} onChange={e => setForm({ ...form, capaianPembelajaran: e.target.value })} />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm">Tujuan Pembelajaran</label>
                  <textarea className="mt-1 block w-full border rounded p-2" value={form.tujuanPembelajaran} onChange={e => setForm({ ...form, tujuanPembelajaran: e.target.value })} />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm">Materi Pelajaran</label>
                  <textarea className="mt-1 block w-full border rounded p-2" value={form.materiPelajaran} onChange={e => setForm({ ...form, materiPelajaran: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm">Jumlah Pertemuan (angka)</label>
                  <input type="number" min="1" className="mt-1 block w-full border rounded p-2" value={form.jumlahPertemuan} onChange={e => setForm({ ...form, jumlahPertemuan: parseInt(e.target.value||1,10) })} />
                  {errors.jumlahPertemuan && <div className="text-red-600 text-xs">{errors.jumlahPertemuan}</div>}
                </div>

                <div>
                  <label className="block text-sm">Durasi Setiap Pertemuan</label>
                  <input className="mt-1 block w-full border rounded p-2" value={form.durasiPertemuan} onChange={e => setForm({ ...form, durasiPertemuan: e.target.value })} />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm">Praktik Pedagogis per Pertemuan</label>
                  <div className="mt-2 space-y-2">
                    {form.praktikPerPertemuan.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-20">Pertemuan {idx+1}</div>
                        <select className="flex-1 border rounded p-2" value={p} onChange={e => {
                          const arr = [...form.praktikPerPertemuan]; arr[idx]=e.target.value; setForm({...form, praktikPerPertemuan: arr});
                        }}>
                          {pedagogies.map(g => <option key={g}>{g}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm">Dimensi Lulusan (pilih multi)</label>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    {dimensiOptions.map(d => (
                      <label key={d} className="flex items-center gap-2">
                        <input type="checkbox" checked={form.dimensiLulusan.includes(d)} onChange={e => {
                          const next = e.target.checked ? [...form.dimensiLulusan, d] : form.dimensiLulusan.filter(x=>x!==d);
                          setForm({...form, dimensiLulusan: next});
                        }} />
                        <span>{d}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              <div className="mt-4 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Generate RPM</button>
                <button type="button" className="px-4 py-2 border rounded" onClick={() => { setForm(initial); }}>Reset</button>
              </div>
            </form>
          </div>
        )}

        {view === 'preview' && (
          <div className="bg-white p-4 rounded shadow mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium">Pratinjau & Output RPM</h2>
              <div className="space-x-2">
                <button className="px-3 py-1 border rounded" onClick={() => setView('form')}>Kembali</button>
                <button className="px-3 py-1 border rounded" onClick={() => { navigator.clipboard.writeText(renderRPMHtml()).then(()=>alert('Tersalin ke clipboard (format HTML).')); }}>Salin (clipboard)</button>
                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={handleCopyAndOpenDocs}>Salin & Buka di Google Dokumen</button>
                <button className="px-3 py-1 border rounded" onClick={handlePrint}>Cetak / PDF</button>
              </div>
            </div>

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderRPMHtml() }} />
          </div>
        )}

      </div>
    </div>
  );
}

// --- small components ---
function Input({ label, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm">{label}</label>
      <input className="mt-1 block w-full border rounded p-2" value={value} onChange={e => onChange(e.target.value)} />
      {error && <div className="text-red-600 text-xs">{error}</div>}
    </div>
  );
}

function LoginForm({ onAdminLogin, onParticipantLogin, adminCreds }) {
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [token, setToken] = useState("");
  const [name, setName] = useState("");

  return (
    <div>
      <div className="mb-4">
        <h3 className="font-medium">Login Admin</h3>
        <p className="text-xs text-gray-500">Masukkan username & password admin (tidak ditampilkan di halaman lain).</p>
        <input className="mt-2 block w-full border rounded p-2" placeholder="Username" value={adminUser} onChange={e=>setAdminUser(e.target.value)} />
        <input className="mt-2 block w-full border rounded p-2" placeholder="Password" type="password" value={adminPass} onChange={e=>setAdminPass(e.target.value)} />
        <div className="mt-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => {
            if (adminUser === adminCreds.username && adminPass === adminCreds.password) {
              const displayName = adminUser;
              onAdminLogin(displayName);
            } else alert('Kredensial admin salah.');
          }}>Masuk sebagai Admin</button>
        </div>
      </div>

      <div>
        <h3 className="font-medium">Login Peserta (Token)</h3>
        <input className="mt-2 block w-full border rounded p-2" placeholder="Nama Peserta" value={name} onChange={e=>setName(e.target.value)} />
        <input className="mt-2 block w-full border rounded p-2" placeholder="Token" value={token} onChange={e=>setToken(e.target.value)} />
        <div className="mt-2">
          <button className="px-3 py-1 border rounded" onClick={() => onParticipantLogin(token, name)}>Masuk sebagai Peserta</button>
        </div>
      </div>
    </div>
  );
}

function CreateTokenForm({ onCreate }) {
  const [name, setName] = useState("");
  return (
    <div className="mt-2">
      <input className="block w-full border rounded p-2" placeholder="Nama peserta (opsional)" value={name} onChange={e=>setName(e.target.value)} />
      <div className="mt-2">
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => { const t = onCreate(name); setName(''); }}>Buat Token</button>
      </div>
    </div>
  );
}
