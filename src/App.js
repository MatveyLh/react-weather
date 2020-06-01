import React from 'react';
import axios from 'axios';
import data from './city.list.json';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            city: null,
            value: '',
            api_key: '4c047cb5be5d5a082a0035db0584842d',
            historyNames: [],
            weatherData: [],
            error: '',
        };
    }

    handleSubmit(event) {
        event.preventDefault();

        const items = data.filter((data)=> {
            if(this.state.value == null) {
                this.setState({error: 'Please complete the data!'});
            }

            else if(data.name.toLowerCase() == this.state.value.toLowerCase()) {
                this.setState({id: data.id, isFinished: true});
                axios.post(`http://api.openweathermap.org/data/2.5/weather?id=${data.id}&appid=${this.state.api_key}`)
                    .then(res => {
                        var flag = false;
                        this.state.historyNames.map((item,index) => {
                            if (res.data.name == item) {
                                this.setState({error: 'City already exists'});
                                flag = true
                            }
                            return flag;
                        })
                        if (flag === false) {
                            this.state.historyNames.push(res.data.name);
                            this.state.weatherData.push(res.data.name, res.data.main.temp);
                            this.setState({error: ''});
                        }

                        this.setState({
                            historyNames: this.state.historyNames,
                            weatherData: this.state.weatherData
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
                
                return data;
            }
        })
    }

    valueChange(event) {
        this.setState({value: event.target.value})
    }

    render() {
        const weather = this.state.weatherData.map((item,index) => {
            return (
                <p key={index}>{item}</p>
            )
        })
        
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <input type={'text'} value={this.state.value} onChange={this.valueChange.bind(this)} required={true}/>
                    <input type={'submit'}/>
                    <p style={{'color':'red'}} className={'error-message'}>{this.state.error}</p>
                </form>
                {weather}
            </div>
        )
    }
}

export default App;
