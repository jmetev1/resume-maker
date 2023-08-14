
const styles = {
  container: {
    display: 'flex',
    // flexDirection: 'column' ,
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '10px',
    background: '#f7f7f7'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textDecoration: 'underline'
  },
  section: {
    marginBottom: '30px',
    padding: '20px',
    border: '1px solid #e1e1e1',
    borderRadius: '5px',
    background: '#fff'
  }
};

const DocumentDisplay = ({ resume, coverLetter }) => (
  <div style={styles.container}>
    <div style={styles.title}>Resume</div>
    <div style={styles.section}>{resume}</div>
    <div style={styles.title}>Cover Letter</div>
    <div style={styles.section}>{coverLetter}</div>
  </div>
);

export default DocumentDisplay;
