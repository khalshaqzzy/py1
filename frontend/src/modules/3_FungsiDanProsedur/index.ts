
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';

const module3 = {
  id: '3',
  title: 'Fungsi dan Prosedur',
  description: 'Membangun blok kode yang dapat digunakan kembali (reusable) untuk memecah masalah kompleks menjadi bagian-bagian yang lebih kecil dan terkelola.',
  sections: [
    {
      id: '1',
      title: "DRY: Don't Repeat Yourself",
      component: Section1,
    },
    {
      id: '2',
      title: 'Mendefinisikan dan Memanggil Fungsi',
      component: Section2,
    },
    {
      id: '3',
      title: 'Parameter dan Argumen',
      component: Section3,
    },
    {
      id: '4',
      title: 'Lingkup Variabel (Variable Scope)',
      component: Section4,
    },
  ],
};

export default module3;
