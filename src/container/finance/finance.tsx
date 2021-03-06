import { Component, React } from 'react';
import { connect } from 'react-redux';
import FinanceSummaryItem from '../../components/reveneutable/financeSummaryItem';
import { HeadTitle } from '../../components/UI/headTitle';
import Input from '../../components/UI/Input';
import handLeft from '../../img/icons/hand-point-left-solid.svg';
import handRight from '../../img/icons/hand-point-right-regular.svg';
import * as actionCreators from '../../store/actions/actionCreators';
import Error from '../../utility/error';
import classes from './finance.module.css';

class Income extends Component {
  constructor (props) {
    super(props);
    this.state = {
      amount: 0,
      reason: '',
      date: '',
      id: this.props.id
    };
    this.page = 1;
    this.itemsToShow = '10';
    this.financeType = '';
  }

  componentDidMount () {
    this.financeType = this.props.location.pathname.slice(1);
    this.props.getFinanceData(this.financeType);
  }

  inputValueHandler = (event, name) => {
    const newstate = { ...this.state, [name]: event.target.value };
    this.setState(newstate);
  };

  render () {
    //* output for income, sorted and sliced for pagination
    let translatedFinanceType = '';
    if (this.financeType === 'income') {
      translatedFinanceType = 'Einnahmen';
    }
    if (this.financeType === 'bills') {
      translatedFinanceType = 'Ausgaben';
    }

    let financeData = '';
    let financeSummaryItem = '';
    let firstItemPerPage = (this.page - 1) * this.itemsToShow;
    let lastItemPerPage = this.page * this.itemsToShow;
    let sum = 0;

    if (this.financeType === 'income') {
      financeData = this.props.financeData.income;
    } else {
      financeData = this.props.financeData.bills;
    }

    if (financeData) {
      financeData.map((data) => {
        return (sum += data.amount);
      });

      financeSummaryItem = financeData

        .sort((a, b) => {
          if (a.date < b.date) {
            return -1;
          }
          if (a.date > b.date) {
            return 1;
          }
          return 0;
        })
        .slice(firstItemPerPage, lastItemPerPage)
        .map((data) => {
          const date = new Date(data.date);
          return (
            <FinanceSummaryItem
              amount={data.amount}
              reason={data.reason}
              date={date.toLocaleDateString('de-DE')}
              key={data._id}
              clicked={(itemID, financeType, oldState) => {
                this.props.deleteFinanceItem(data._id, this.financeType, this.props.financeData.income);
              }}
            />
          );
        });
    }

    const reasonHead = 'reasonHead';
    const amountHead = 'amountHead';
    const dateHead = 'dateHead';
    return (
      <>
        <div>
          <HeadTitle site={translatedFinanceType} />
          <div className={classes.itemCounter}>
            Angezeigte Elemente:
            <select
              name='itemsToShow'
              id=''
              onChange={(event) => {
                this.itemsToShow = event.target.value;
                this.props.getFinanceData(this.financeType);
              }}>
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </select>
          </div>
          <div className={classes.overview}>
            <h2 className={reasonHead}>Zweck</h2>
            <h2 className={amountHead}>Betrag</h2>
            <h2 className={dateHead}>Datum</h2>
            <div></div>
            {financeSummaryItem}
          </div>
          <div>Sum = {sum} €</div>

          <div className={classes.paginationControll}>
            <div className={classes.pageBack}>
              <img
                src={handLeft}
                alt=''
                srcSet=''
                onClick={() => {
                  this.page >= 2 ? (this.page -= 1) : (firstItemPerPage = 0);
                  this.props.getFinanceData(this.financeType);
                }}
              />
            </div>
            <div className={classes.pageForward}>
              <img
                src={handRight}
                alt=''
                srcSet=''
                onClick={() => {
                  financeData.length % lastItemPerPage === financeData.length
                    ? (lastItemPerPage = financeData.length)
                    : (this.page += 1);
                  this.props.getFinanceData(this.financeType);
                }}
              />
            </div>
          </div>
          <div className={classes.form}>
            <Input
              class={classes.input_income}
              type={'number'}
              isValid={true}
              name={this.state.amount}
              placeholder={299.99}
              changeValue={(event, name) => {
                this.inputValueHandler(event, 'amount');
              }}>
              {this.state.amount}
            </Input>
            <Input
              class={classes.input_income}
              type={'text'}
              isValid={true}
              name={this.state.reason}
              placeholder={'Zweck'}
              changeValue={(event, name) => {
                this.inputValueHandler(event, 'reason');
              }}>
              {this.state.reason}
            </Input>
            <Input
              class={classes.input_income}
              type={'date'}
              isValid={true}
              name={this.state.date}
              placeholder={'Datum'}
              changeValue={(event, name) => {
                this.inputValueHandler(event, 'date');
              }}>
              {this.state.date}
            </Input>
          </div>
          <Error />
          <button
            className={classes.submitBtn}
            onClick={(amount, reason, date, id, financeType) => {
              this.props.insertFinanceData(
                this.state.amount,
                this.state.reason,
                this.state.date,
                this.state.id,
                this.financeType
              );
            }}>
            Füge {translatedFinanceType} hinzu
          </button>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    id: state.id,
    financeData: state.financeData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getFinanceData: (financeType) => dispatch(actionCreators.financeActions.getFinance(financeType)),
    deleteFinanceItem: (itemID, financeType, oldState) =>
      dispatch(actionCreators.financeActions.deleteHandler(itemID, financeType, oldState)),
    insertFinanceData: (amount, reason, date, id, financeType) =>
      dispatch(actionCreators.financeActions.insertFinanceData(amount, reason, date, id, financeType))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Income);
