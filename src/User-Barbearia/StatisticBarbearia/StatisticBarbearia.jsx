import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './StatisticBarbearia.css'

const data = [
    {
      name: 'Jan',
      uv: 1000,
      
    },
    {
      name: 'Fev',
      uv: 1100,
      
    },
    {
      name: 'Mar',
      uv: 1200,
      
    },
    {
      name: 'Abr',
      uv: 1300,
      
    },
    {
      name: 'Mai',
      uv: 1400,
    
    },
    {
      name: 'Jun',
      uv: 1500,
     
    },
    {
      name: 'Jul',
      uv: 1690,
    },
    {
        name: 'Ago',
        uv: 1790,
      },
      {
        name: 'Set',
        uv: 1890,
      },
      {
        name: 'Out',
        uv: 1990,
      },
      {
        name: 'Nov',
        uv: 2190,
      },
      {
        name: 'Dez',
        uv: 2190,
      },
  ];


function StatisticBarbearia (){

           
    return (
        <div className='container__statistic__barbearia'>
            <div>
                <h3>2024</h3>
            </div>
            <div className='section__grafic__barbearia'>
                <AreaChart
                    width={550}
                    height={200}
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                }}>

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#4a17d537" fill="#4a17d537" />
                </AreaChart>
            </div>
            
        </div>
      );
}
export default StatisticBarbearia;