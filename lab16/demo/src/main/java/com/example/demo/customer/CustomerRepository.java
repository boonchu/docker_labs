package demo;

import org.springframework.data.repository.CrudRepository;
import java.util.List;
import demo.Customer;

public interface CustomerRepository extends CrudRepository<Customer, Long> {
    List<Customer> findByFirstName(String firstName);
}
