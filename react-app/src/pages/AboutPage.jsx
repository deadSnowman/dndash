import NavBar from '../components/NavBar.jsx';
import aboutImage from '../../../images/ledrungorogin_colored.png';

export default function AboutPage() {
  return (
    <div className="outer-container">
      <NavBar active="about" />
      <div className="content container body">
        <div className="row">
          <div className="col-sm-6">
            <div className="centerstuff">
              <h1>Welcome to DnDash!</h1>
              <h3>A DnD dash board application written with React</h3>
              <br />
              <p>Contains functionality for...</p>
              <ul>
                <li>Loot splitting</li>
                <li>Currency conversion</li>
                <li>Die rolling</li>
              </ul>
            </div>
          </div>
          <div className="col-sm-6">
            <img src={aboutImage} className="about-image" alt="DnDash character illustration" />
          </div>
        </div>
      </div>
      <footer>
        <div className="footer navbar-dark">
          <p>Copyright &copy; 2018 Seth Thomas (deadSnowman)</p>
          <p>
            Fork me on <a href="https://github.com/deadSnowman/dndash">Github</a>
          </p>
          <p>
            Check out my other site <a href="http://www.dsm-comics.com">DSM Comics</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
